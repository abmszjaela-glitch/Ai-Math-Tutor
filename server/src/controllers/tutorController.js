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

Return the response using the required structured format.

message:
A friendly explanation for the student.

steps:
Clear mathematical steps.

Every step MUST contain:

- step
- explanation
- calculation

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

Only return the final structured response after
passing these checks.
`;

    // =====================================================
    // 11. CALL OPENAI
    // =====================================================

    const response =
      await openai.responses.create({
        model: "gpt-5.6-luna",

        instructions: systemPrompt,

        input: studentMessage,

        text: {
          format: {
            type: "json_schema",

            name: "math_tutor_response",

            strict: true,

            schema: tutorResponseSchema,
          },
        },
      });

    // =====================================================
    // 12. GET AI OUTPUT
    // =====================================================

    const rawOutput =
      response.output_text;

    if (!rawOutput) {
      return res.status(500).json({
        success: false,
        message:
          "AI returned an empty response",
      });
    }

    // =====================================================
    // 13. PARSE STRUCTURED OUTPUT
    // =====================================================

    let tutorResponse;

    try {
      tutorResponse =
        JSON.parse(rawOutput);
    } catch (error) {
      console.error(
        "AI JSON parsing error:",
        error
      );

      console.error(
        "Raw AI response:",
        rawOutput
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid structured response",
      });
    }

    // =====================================================
    // 14. EXTRA SERVER-SIDE VALIDATION
    // =====================================================

    if (
      typeof tutorResponse.message !==
      "string"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor message",
      });
    }

    if (
      !Array.isArray(
        tutorResponse.steps
      )
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor steps",
      });
    }

    if (
      typeof tutorResponse.answer !==
      "string"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor answer",
      });
    }

    if (
      typeof tutorResponse.hint !==
      "string"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor hint",
      });
    }

    if (
      typeof tutorResponse.encouragement !==
      "string"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor encouragement",
      });
    }

    if (
      typeof tutorResponse.topic !==
      "string"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor topic",
      });
    }

    if (
      ![
        "easy",
        "medium",
        "hard",
      ].includes(
        tutorResponse.difficulty
      )
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Invalid tutor difficulty",
      });
    }

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
    // 17. RETURN RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      response: {
        messageId:
          savedMessage.id,

        conversationId:
          conversation.id,

        tutor:
          tutorResponse,
      },
    });
  } catch (error) {
    console.error(
      "Tutor message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process tutor message",
    });
  }
};


module.exports = {
  sendTutorMessage,
};