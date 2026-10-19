const { z } = require("zod");
const id = z.string().trim().min(1).max(200);
const tutorInput = z.object({
  conversationId: id,
  lessonId: id.nullish(),
  message: z.string().trim().min(1).max(4000),
});
const tutorOutput = z.object({
  message: z.string().min(1),
  steps: z.array(z.object({ step: z.number().int().positive(), explanation: z.string(), calculation: z.string() }).strict()),
  answer: z.string(), hint: z.string(), encouragement: z.string(), topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
}).strict();
const progressInput = z.object({
  lessonId: id, completed: z.boolean().optional(), score: z.number().finite().min(0).max(100).optional(),
}).refine((value) => value.completed !== undefined || value.score !== undefined, { message: "Provide completed or score" });
const messageInput = z.object({ role: z.literal("user").default("user"), content: z.string().trim().min(1).max(4000) });
const conversationInput = z.object({ title: z.string().trim().min(1).max(200).optional() });
const avatarInput = z.object({ avatarId: id });
module.exports = { tutorInput, tutorOutput, progressInput, messageInput, conversationInput, avatarInput };
