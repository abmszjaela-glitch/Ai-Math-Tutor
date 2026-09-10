const prisma = require("../config/prisma");
const openai = require("../config/openai");

const sendTutorMessage = async (req, res) => {
  try {
    const {
      conversationId,
      lessonId,
      message,
    } = req.body;

    // =========================
    // VALIDATE REQUEST
    // =========================

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID and message are required",
      });
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    // =========================
    // GET STUDENT
    // =========================

    const student = await prisma.student.findUnique({
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

    // =========================
    // VERIFY CONVERSATION
    // =========================

    const conversation = await prisma.conversation.findFirst({
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

    // =========================
    // GET LESSON
    // =========================

    let lesson = null;

    if (lessonId) {
      lesson = await prisma.lesson.findUnique({
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

    // =========================
    // SAVE STUDENT MESSAGE
    // =========================

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: message.trim(),
      },
    });

    // Update conversation activity time
    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    // =========================
    // AVATAR INFORMATION
    // =========================

    const avatarName =
      student.avatar?.name || "Math Tutor";

    const avatarPersonality =
      student.avatar?.personality ||
      "Friendly, patient and encouraging.";

    // =========================
    // LESSON INFORMATION
    // =========================

    const lessonContext = lesson
      ? `
Current lesson:
Title: ${lesson.title}
Topic: ${lesson.topic.name}
Description: ${
          lesson.description || "No description available."
        }
`
      : `
No specific lesson was selected.
`;

    // =========================
    // CONVERSATION HISTORY
    // =========================

    const previousMessages = conversation.messages
      .map((item) => {
        const role =
          item.role === "assistant"
            ? "Tutor"
            : "Student";

        return `${role}: ${item.content}`;
      })
      .join("\n");

    // =========================
    // AI SYSTEM INSTRUCTIONS
    // =========================

    const systemPrompt = `
You are ${avatarName}, an AI mathematics tutor for children.

STUDENT INFORMATION
-------------------
Grade: ${student.grade.number}

AVATAR PERSONALITY
------------------
${avatarPersonality}

LESSON INFORMATION
------------------
${lessonContext}

YOUR MAIN GOAL
--------------
Teach mathematics.

Do not behave like a generic chatbot.
You are a patient mathematics teacher helping a child understand the idea.

TEACHING RULES
--------------
1. Explain mathematics at the student's grade level.
2. Use simple and friendly language.
3. Be patient and encouraging.
4. Break difficult problems into small steps.
5. Help the student understand WHY an answer is correct.
6. Do not immediately reveal an answer when the student should reasonably try first.
7. If the student gives an incorrect answer, gently explain the mistake.
8. Never shame, insult or discourage the student.
9. Stay focused on mathematics and learning.
10. Do not ask the child for unnecessary personal information.
11. Use mathematical notation when useful.
12. Do not invent information about the student's progress.
13. Do not pretend that you know something that is not provided.
14. If the question is unrelated to mathematics, politely guide the student back to mathematics.
15. Keep explanations appropriate for a child.

WHEN SOLVING A MATH PROBLEM
--------------------------
1. Understand the problem.
2. Identify the mathematical concept.
3. Explain the idea simply.
4. Show clear steps.
5. Give the correct answer when appropriate.
6. Provide a useful hint when appropriate.
7. Encourage the student.

STRUCTURED RESPONSE
-------------------
Your response MUST contain these fields:

message:
A friendly explanation for the student.

steps:
A list of clear mathematical steps.
Each step must contain:
- step
- explanation
- calculation

answer:
The final mathematical answer.
If it is not appropriate to reveal the final answer yet, use an empty string.

hint:
A short hint that helps the student continue thinking.
If no hint is necessary, use an empty string.

encouragement:
A short positive sentence.

topic:
The mathematical topic being discussed.

difficulty:
One of:
- easy
- medium
- hard

IMPORTANT
---------
Return ONLY valid JSON.
Do not use Markdown code fences.
Do not add text before or after the JSON.

PREVIOUS CONVERSATION
---------------------
${previousMessages}
`;

    // =========================
    // CALL OPENAI
    // =========================

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions: systemPrompt,
      input: message.trim(),
    });

    // =========================
    // GET AI OUTPUT
    // =========================

    const rawOutput = response.output_text;

    if (!rawOutput) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty response",
      });
    }

    // =========================
    // PARSE JSON
    // =========================

    let tutorResponse;

    try {
      tutorResponse = JSON.parse(rawOutput);
    } catch (parseError) {
      console.error(
        "AI JSON parsing error:",
        parseError
      );

      console.error(
        "Raw AI response:",
        rawOutput
      );

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid structured response",
      });
    }

    // =========================
    // VALIDATE STRUCTURE
    // =========================

    if (
      typeof tutorResponse.message !== "string" ||
      !Array.isArray(tutorResponse.steps) ||
      typeof tutorResponse.answer !== "string" ||
      typeof tutorResponse.hint !== "string" ||
      typeof tutorResponse.encouragement !== "string" ||
      typeof tutorResponse.topic !== "string" ||
      !["easy", "medium", "hard"].includes(
        tutorResponse.difficulty
      )
    ) {
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid tutor response structure",
      });
    }

    // =========================
    // SAVE AI MESSAGE
    // =========================

    const savedMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: JSON.stringify(tutorResponse),
      },
    });

    // Update conversation activity time
    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    // =========================
    // RETURN RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      response: {
        messageId: savedMessage.id,
        conversationId: conversation.id,

        tutor: tutorResponse,
      },
    });
  } catch (error) {
    console.error(
      "Tutor message error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to process tutor message",
    });
  }
};

module.exports = {
  sendTutorMessage,
};