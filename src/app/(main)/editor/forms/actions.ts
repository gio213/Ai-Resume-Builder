"use server";

import openAi from "@/lib/openAi";
import { canUseAiTools } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import {
  GenerateSUmmaryInput,
  generateSummarySchema,
  GenerateWorkExmpereienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export const generateSummary = async (input: GenerateSUmmaryInput) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAiTools(subscriptionLevel)) {
    throw new Error("You need a premium subscription to use AI tools");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. your task is to write professional introduction summary fro a resume given the users provided data. Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title ${jobTitle} || "N/A"

    Work Experience:
    ${workExperiences
      ?.map(
        (exp) =>
          `Position: ${exp.position} || "N/A" at ${exp.company} || "N/A" from ${exp.startDate} || "N/A"to ${exp.endDate} || "Present" Description: ${exp.description} || "N/A"`,
      )
      .join("\n\n")}
       Work Experience:
    ${educations
      ?.map(
        (edu) =>
          `Degree: ${edu.degree} || "N/A" at ${edu.shcool} || "N/A" from ${edu.startDate} || "N/A"to ${edu.endDate} || "N/a"`,
      )
      .join("\n\n")}


      Skills:${skills}
    `;

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });
  const aiResponse = completion.choices[0].message.content;
  if (!aiResponse) {
    throw new Error("Failed to generate AI  response");
  }
  return aiResponse;
};

export const generateWorkExperience = async (
  input: GenerateWorkExmpereienceInput,
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getUserSubscriptionLevel(userId);

  if (!canUseAiTools(subscriptionLevel)) {
    throw new Error("You need a premium subscription to use AI tools");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. your task is to generate a single work experience entry based on the user input.
  must add here to the following structure. You can omit field if the information can not be infered from the provided data, but dont add any new ones.

  Job title: <job title>
  company: <company name>
  Start date: <format: YYYY-MM-DD> (inly if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be infered from the job title>

  `;

  const userMessage = `
  Please provide a work experience entry from this description:${description}
  `;

  const completion = await openAi.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });
  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
};
