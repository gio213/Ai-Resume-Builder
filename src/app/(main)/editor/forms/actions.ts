"use server";

import openAi from "@/lib/openAi";
import {
  GenerateSUmmaryInput,
  generateSummarySchema,
  GenerateWorkExmpereienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { getLocale } from "next-intl/server";

export const generateSummary = async (input: GenerateSUmmaryInput) => {
  const { userId } = await auth();
  const locale = await getLocale();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  // Create messages with explicit string formatting to avoid namespace issues
  const systemMessage = [
    `You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.`,
    `Only return the summary and do not include any other information in the response.`,
    `Keep it concise and professional.`,
    locale === "ka"
      ? `Write the summary in Georgian language.`
      : `Write the summary in English language.`,
  ].join(" "); // Combine lines without introducing periods in unexpected places.

  const userMessage = [
    `Please generate a professional resume summary from this data:`,
    ``,
    `Job title: ${jobTitle} || "N/A"`,
    ``,
    `Work Experience:`,
    workExperiences
      ?.map(
        (exp) =>
          `Position: ${exp.position} || "N/A" at ${exp.company} || "N/A" from ${exp.startDate} || "N/A" to ${exp.endDate} || "Present". Description: ${exp.description} || "N/A".`,
      )
      .join("\n\n"),
    ``,
    `Education:`,
    educations
      ?.map(
        (edu) =>
          `Degree: ${edu.degree} || "N/A" at ${edu.shcool} || "N/A" from ${edu.startDate} || "N/A" to ${edu.endDate} || "N/A".`,
      )
      .join("\n\n"),
    ``,
    `Skills: ${skills}`,
  ].join("\n");

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

  return aiResponse;
};

export const generateWorkExperience = async (
  input: GenerateWorkExmpereienceInput,
) => {
  const { userId } = await auth();
  const locale = await getLocale();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { description } = generateWorkExperienceSchema.parse(input);

  // Adjust the systemMessage based on the language
  const systemMessage = [
    `You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.`,
    `The entry must adhere to the following structure. Omit fields if the information cannot be inferred from the provided data, but do not add any new ones.`,
    ``,
    `Job title: <job title>`,
    `Company: <company name>`,
    `Start date: <format: YYYY-MM-DD> (only if provided)`,
    `End date: <format: YYYY-MM-DD> (only if provided)`,
    `Description: <an optimized description in bullet format, inferred from the job title if necessary>.`,
    ``,
    locale === "ka"
      ? "Provide the work experience entry in Georgian language."
      : "Provide the work experience entry in English language.",
  ].join(" ");

  const userMessage = `Please provide a work experience entry from this description: ${description}`;

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
