import { env } from "@/env";
import OpenAi from "openai";

const openAi = new OpenAi({
  apiKey: env.OPENAI_API_KEYY,
});

export default openAi;
