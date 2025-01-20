import OpenAi from "openai";

const openAi = new OpenAi({
  apiKey: process.env.OPENAI_API_KEYY,
});

export default openAi;
