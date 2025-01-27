import { env } from "@/env";
import OpenAi from "openai";

const openAi = new OpenAi({
  apiKey: env.OPENAI_API_KEY,
});

export default openAi;
