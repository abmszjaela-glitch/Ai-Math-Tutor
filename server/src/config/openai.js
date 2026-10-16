const OpenAI = require("openai");
let client;
module.exports = function getOpenAI() {
  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error("AI service is not configured");
    error.status = 503;
    throw error;
  }
  client ||= new OpenAI({ apiKey: process.env.OPENROUTER_API_KEY, baseURL: "https://openrouter.ai/api/v1", timeout: 60000, maxRetries: 1 });
  return client;
};
