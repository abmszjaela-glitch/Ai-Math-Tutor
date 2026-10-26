const prisma = require("../config/prisma");
const openai = require("../config/openai");

const tutorResponseSchema = {
  type: "object",
  additionalProperties: false,

  properties: {
    message: {
      type: "string",
    },

    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,

        properties: {
          step: {
            type: "integer",
          },

          explanation: {
            type: "string",
          },

          calculation: {
            type: "string",
          },
        },

        required: [
          "step",
          "explanation",
          "calculation",
        ],
      },
    },

    answer: {
      type: "string",
    },

    hint: {
      type: "string",
    },

    encouragement: {
      type: "string",
    },

    topic: {
      type: "string",
    },

    difficulty: {
      type: "string",
      enum: ["easy", "medium", "hard"],
    },
  },

  required: [
    "message",
    "steps",
    "answer",
    "hint",
    "encouragement",
    "topic",
    "difficulty",
  ],
};


// =========================================================
// STREAMING HELPERS
// =========================================================

/**
 * Incremental scanner for the tutor JSON while it is still being generated.
 *
 * Feed it text chunks with push(). It calls:
 *   onField(key, stringValue)  when a top-level string field is complete
 *   onStep(stepObject)         when one object inside "steps" is complete
 *
 * The final full JSON.parse after the stream ends is still the source of
 * truth; this scanner only lets us start sending parts early.
 */
const createPartParser = (onField, onStep) => {
  let buf = "";
  let i = 0;
  let depth = 0;
  let inStr = false;
  let esc = false;
  let strStart = -1;
  let strIsKey = false;
  let currentKey = null;
  let stepStart = -1;

  const safeParse = (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return undefined;
    }
  };

  return (chunk) => {
    buf += chunk;

    for (; i < buf.length; i++) {
      const ch = buf[i];

      if (inStr) {
        if (esc) {
          esc = false;
          continue;
        }

        if (ch === "\\") {
          esc = true;
          continue;
        }

        if (ch === '"') {
          inStr = false;

          const value = safeParse(buf.slice(strStart, i + 1));

          if (strIsKey) {
            currentKey = typeof value === "string" ? value : null;
            if (currentKey === null) strIsKey = false;
          } else if (depth === 1 && currentKey && typeof value === "string") {
            onField(currentKey, value);
            currentKey = null;
          }
        }

        continue;
      }

      if (ch === '"') {
        inStr = true;
        strStart = i;
        // At depth 1 with no pending key, the next string is a key.
        strIsKey = depth === 1 && currentKey === null;
        continue;
      }

      if (ch === "{") {
        depth++;
        if (depth === 3) stepStart = i;
        continue;
      }

      if (ch === "}") {
        if (depth === 3 && stepStart >= 0) {
          const step = safeParse(buf.slice(stepStart, i + 1));
          if (step && typeof step === "object") onStep(step);
          stepStart = -1;
        }
        depth--;
        continue;
      }

      if (ch === "[") {
        depth++;
        continue;
      }

      if (ch === "]") {
        depth--;
        if (depth === 1) currentKey = null;
        continue;
      }
    }
  };
};

// Parses the complete model output, tolerating code fences or stray text.
const parseTutorJson = (rawOutput) => {
  let jsonText = rawOutput.trim();

  if (jsonText.startsWith("```")) {
    jsonText = jsonText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  const first = jsonText.indexOf("{");
  const last = jsonText.lastIndexOf("}");

  if (first !== -1 && last > first) {
    jsonText = jsonText.slice(first, last + 1);
  }

  return JSON.parse(jsonText);
};

// Returns an error message, or null when the response is valid.
const validateTutorResponse = (tutor) => {
  if (!tutor || typeof tutor !== "object") return "Invalid tutor response";
  if (typeof tutor.message !== "string") return "Invalid tutor message";
  if (!Array.isArray(tutor.steps)) return "Invalid tutor steps";
  if (typeof tutor.answer !== "string") return "Invalid tutor answer";
  if (typeof tutor.hint !== "string") return "Invalid tutor hint";
  if (typeof tutor.encouragement !== "string") return "Invalid tutor encouragement";
  if (typeof tutor.topic !== "string") return "Invalid tutor topic";

  if (!["easy", "medium", "hard"].includes(tutor.difficulty)) {
    return "Invalid tutor difficulty";
  }

  for (const step of tutor.steps) {
    if (
      !step ||
      typeof step.step !== "number" ||
      !Number.isInteger(step.step) ||
      typeof step.explanation !== "string" ||
      typeof step.calculation !== "string"
    ) {
      return "Invalid tutor step format";
    }
  }

  return null;
};


const sendTutorMessage = async (req, res) => {
  try {
    const {
      conversationId,
      lessonId,
      message,
    } = req.body;


    // =====================================================
    // 1. VALIDATE REQUEST
    // =====================================================

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Conversation ID and message are required",
      });
    }

    if (
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const studentMessage = message.trim();


    // =====================================================
    // 2. GET STUDENT
    // =====================================================

    const student =
      await prisma.student.findUnique({
        where: {
          userId: req.userId,
        },

        include: {
          grade: true,
          avatar: true,
        },
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }


    // =====================================================
    // 3. VERIFY CONVERSATION
    // =====================================================

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          studentId: student.id,
        },

        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }


    // =====================================================
    // 4. GET LESSON
    // =====================================================

    let lesson = null;
    if (lessonId) {
      lesson =
        await prisma.lesson.findUnique({
          where: {
            id: lessonId,
          },

          include: {
            topic: true,
          },
        });

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found",
        });
      }
    }


    // =====================================================
    // 5. SAVE STUDENT MESSAGE
    // =====================================================

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: studentMessage,
      },
    });


    // =====================================================
    // 6. UPDATE CONVERSATION TIME
    // =====================================================

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },

      data: {
        updatedAt: new Date(),
      },
    });


    // =====================================================
    // 7. AVATAR INFORMATION
    // =====================================================

    const avatarName =
      student.avatar?.name || "Math Tutor";

    const avatarPersonality =
      student.avatar?.personality ||
      "Friendly, patient and encouraging.";


    // =====================================================
    // 8. LESSON INFORMATION
    // =====================================================

    const lessonContext = lesson
      ? `
Current lesson:
Title: ${lesson.title}
Topic: ${lesson.topic.name}
Description: ${
          lesson.description ||
          "No description available."
        }
`
      : `
No specific lesson was selected.
`;


    // =====================================================
    // 9. PREVIOUS CONVERSATION
    // =====================================================

    const previousMessages =
      conversation.messages
        .map((item) => {
          const role =
            item.role === "assistant"
              ? "Tutor"
              : "Student";

          return `${role}: ${item.content}`;
        })
        .join("\n");


    // =====================================================
    // 10. SYSTEM INSTRUCTIONS
    // =====================================================

    const systemPrompt = `
You are ${avatarName}, an AI mathematics tutor for children.

Your job is to teach mathematics clearly, accurately,
patiently and safely.


====================================================
STUDENT
====================================================

Grade: ${student.grade.number}


====================================================
AVATAR PERSONALITY
====================================================

${avatarPersonality}


====================================================
CURRENT LESSON
====================================================

${lessonContext}


====================================================
MOST IMPORTANT RULE: MATHEMATICAL ACCURACY
====================================================

You MUST solve the student's mathematics problem
correctly.

Before producing your final response:

1. Read the student's exact question carefully.
2. Identify all numbers and mathematical information.
3. Solve the problem yourself.
4. Check the calculation again.
5. Make sure the final answer agrees with every step.
6. Never change a number from the student's question.
7. Never invent numbers.
8. Never guess a mathematical answer.

For example:

If the student asks:

"What is 25 + 17?"

You MUST use:

25 + 17

NOT:

25 + 13

The correct answer is:

42

Your explanation, calculations and answer must all
agree with each other.


====================================================
TEACHING STYLE
====================================================

Teach like a kind teacher helping a young child.

Use:

- Simple language
- Short explanations
- Clear steps
- Friendly examples
- Encouragement
- Age-appropriate explanations

Do not:

- Shame the student
- Insult the student
- Make the student feel bad
- Use unnecessarily complicated language
- Give unrelated information
- Ask for unnecessary personal information


====================================================
WHEN SOLVING A PROBLEM
====================================================

Follow this process:

1. Understand the question.
2. Identify what the student needs to find.
3. Identify the mathematical concept.
4. Solve the problem carefully.
5. Check the calculation.
6. Explain the solution step by step.
7. Give the answer when appropriate.
8. Give a hint when useful.
9. Encourage the student.


====================================================
IF THE STUDENT IS WRONG
====================================================

Never simply say:

"Wrong."

Instead:

- Be kind.
- Identify the mistake.
- Explain why it is incorrect.
- Show the correct method.
- Encourage another attempt.


====================================================
IF THE STUDENT ASKS A SIMPLE QUESTION
====================================================

Do not make the answer unnecessarily complicated.

For example, for:

"What is 5 + 3?"

A short explanation is enough.


====================================================
IF THE QUESTION IS NOT MATHEMATICS
====================================================

Politely guide the student back toward mathematics.


====================================================
CONVERSATION CONTEXT
====================================================

Here are previous messages from this conversation:

${previousMessages}

Use this context to maintain continuity.


====================================================
CURRENT STUDENT MESSAGE
====================================================

${studentMessage}


====================================================
RESPONSE
====================================================

Return ONLY valid JSON.

Do NOT return YAML.

Do NOT return Markdown.

Do NOT use code fences.

Do NOT add any text before or after the JSON.

The JSON must contain exactly these fields,
written in exactly this order:

message:
A friendly explanation for the student.

steps:
An array of clear mathematical steps.

Every step MUST contain:

- step
- explanation
- calculation

The "step" field MUST be an integer such as 1, 2, or 3.

answer:
The correct final mathematical answer.

If the question does not require a final answer,
use an empty string.

hint:
A short helpful hint.

If no hint is necessary,
use an empty string.

encouragement:
A short positive sentence.

topic:
The mathematics topic.

difficulty:
Must be exactly one of:

easy
medium
hard


====================================================
FINAL ACCURACY CHECK
====================================================

Before returning the response, silently verify:

- Did I use the exact numbers from the student's question?
- Are all calculations correct?
- Does the final answer match the calculations?
- Are the steps logically correct?
- Is the explanation appropriate for the student's grade?

Only return the final JSON response after
passing these checks.
`;


    // =====================================================
    // 11. CALL OPENROUTER (STREAMING)
    // =====================================================
    // The request is made BEFORE any response headers are sent, so
    // errors such as 401 or 429 can still be returned as normal JSON.

    const stream =
      await openai().chat.completions.create({
        // "openrouter/free" is OpenRouter's Free Models Router.
        // It randomly picks a currently-available free model,
        // filtering for ones that support the features this
        // request needs (structured outputs / json_schema here),
        // so it won't break the moment one specific free slug
        // (like openai/gpt-oss-120b:free) gets pulled or rate-limited.
        model: "openrouter/free",

        stream: true,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },

          {
            role: "user",
            content: studentMessage,
          },
        ],

        response_format: {
          type: "json_schema",

          json_schema: {
            name: "math_tutor_response",
            strict: true,
            schema: tutorResponseSchema,
          },
        },
      });


    // =====================================================
    // 12. OPEN THE NDJSON STREAM TO THE BROWSER
    // =====================================================
    // One JSON object per line:
    //   {"type":"message","text":"..."}
    //   {"type":"step","step":1,"explanation":"...","calculation":"..."}
    //   {"type":"answer","text":"..."}
    //   {"type":"hint","text":"..."}
    //   {"type":"encouragement","text":"..."}
    //   {"type":"done","messageId":"..."}
    //   {"type":"error","message":"..."}

    res.status(200);
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // stop nginx buffering
    res.flushHeaders();
    res.socket?.setNoDelay(true);

    // If the student interrupts (new question, mic, leaves the page),
    // the browser aborts the request: stop reading from the AI too.
    let aborted = false;

    res.on("close", () => {
      if (!res.writableFinished) {
        aborted = true;
        try {
          stream.controller?.abort();
        } catch {
          // Ignore abort errors.
        }
      }
    });

    const send = (part) => {
      if (aborted || res.writableEnded) return;
      res.write(`${JSON.stringify(part)}\n`);
      res.flush?.(); // needed if a compression middleware is active
    };

    // Tracks what has already been sent so nothing is sent twice.
    const sent = {
      message: false,
      steps: 0,
      answer: false,
      hint: false,
      encouragement: false,
    };

    const emitField = (key, value) => {
      const text = typeof value === "string" ? value.trim() : "";

      switch (key) {
        case "message":
          if (sent.message) return;
          sent.message = true;
          if (text) send({ type: "message", text });
          break;

        case "answer":
          if (sent.answer) return;
          sent.answer = true;
          if (text) send({ type: "answer", text });
          break;

        case "hint":
          if (sent.hint) return;
          sent.hint = true;
          if (text) send({ type: "hint", text });
          break;

        case "encouragement":
          if (sent.encouragement) return;
          sent.encouragement = true;
          if (text) send({ type: "encouragement", text });
          break;

        default:
          break; // topic and difficulty are not sent to the browser
      }
    };

    const emitStep = (step) => {
      sent.steps += 1;

      if (typeof step.explanation !== "string" || !step.explanation.trim()) return;

      send({
        type: "step",
        step: Number.isInteger(step.step) ? step.step : sent.steps,
        explanation: step.explanation,
        calculation:
          typeof step.calculation === "string" ? step.calculation : "",
      });
    };

    const pushChunk = createPartParser(emitField, emitStep);


    // =====================================================
    // 13. READ THE AI STREAM AND FORWARD PARTS EARLY
    // =====================================================

    let rawOutput = "";

    try {
      for await (const chunk of stream) {
        if (aborted) break;

        const delta = chunk.choices?.[0]?.delta?.content;

        if (!delta) continue;

        rawOutput += delta;
        pushChunk(delta);
      }
    } catch (streamError) {
      if (aborted) return;
      throw streamError;
    }

    if (aborted) return;

    rawOutput = rawOutput.trim();

    if (!rawOutput) {
      console.error("OpenRouter returned an empty streamed response");
      send({ type: "error", message: "AI returned an empty response" });
      return res.end();
    }

    console.log("Raw AI response:", rawOutput);


    // =====================================================
    // 14. PARSE + VALIDATE THE COMPLETE RESPONSE
    // =====================================================

    let tutorResponse;

    try {
      tutorResponse = parseTutorJson(rawOutput);
    } catch (error) {
      console.error("AI JSON parsing error:", error);
      console.error("Raw AI response:", rawOutput);

      send({
        type: "error",
        message: "AI returned an invalid structured response",
      });
      return res.end();
    }

    const validationError = validateTutorResponse(tutorResponse);

    if (validationError) {
      console.error("Tutor validation error:", validationError);

      send({ type: "error", message: validationError });
      return res.end();
    }

    // Safety net: send anything the live scanner did not catch.
    emitField("message", tutorResponse.message);
    tutorResponse.steps.slice(sent.steps).forEach(emitStep);
    emitField("answer", tutorResponse.answer);
    emitField("hint", tutorResponse.hint);
    emitField("encouragement", tutorResponse.encouragement);


    // =====================================================
    // 15. SAVE AI MESSAGE
    // =====================================================

    const savedMessage =
      await prisma.message.create({
        data: {
          conversationId:
            conversation.id,

          role: "assistant",

          content:
            JSON.stringify(
              tutorResponse
            ),
        },
      });


    // =====================================================
    // 16. UPDATE CONVERSATION TIME
    // =====================================================

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },

      data: {
        updatedAt: new Date(),
      },
    });


    // =====================================================
    // 17. FINISH THE STREAM
    // =====================================================

    send({ type: "done", messageId: savedMessage.id });

    return res.end();


  } catch (error) {

    // =====================================================
    // 18. ERROR HANDLING
    // =====================================================

    console.error(
      "Tutor message error:",
      error
    );

    // Stream already started: headers are sent, so report inside the stream.
    if (res.headersSent) {
      if (!res.writableEnded) {
        res.write(
          `${JSON.stringify({
            type: "error",
            message: "Unable to process tutor message",
          })}\n`
        );
        res.end();
      }
      return;
    }

    // OpenRouter / API rate limit
    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "The AI tutor is temporarily unavailable because the free AI usage limit has been reached. Please try again later.",
      });
    }


    // Authentication / API key problem
    if (error?.status === 401) {
      return res.status(500).json({
        success: false,
        message:
          "AI service authentication failed. Please check the OpenRouter API key.",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Unable to process tutor message",
    });
  }
};
module.exports = { sendTutorMessage };
