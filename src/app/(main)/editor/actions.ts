"use server";

import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import { PaymentStatus } from "@prisma/client";

export const saveResume = async (values: ResumeValues) => {
  const { id } = values;
  const { photo, workExperiences, educations, languages, ...resumeValues } =
    resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(`resume_photos/${userId}/${photo.name}`, photo, {
      access: "public",
    });

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  // Use a transaction to ensure both resume and payment are created atomically
  return await prisma.$transaction(async (tx) => {
    let resume;

    if (id) {
      resume = await tx.resume.update({
        where: { id },
        data: {
          ...resumeValues,
          photoUrl: newPhotoUrl,
          workExperiences: {
            deleteMany: {},
            create: workExperiences?.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate) : undefined,
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            })),
          },
          Education: {
            deleteMany: {},
            create: educations?.map((edu) => ({
              ...edu,
              startDate: edu.startDate ? new Date(edu.startDate) : undefined,
              endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            })),
          },
          Language: {
            deleteMany: {},
            create: languages?.map((lang) => ({
              ...lang,
            })),
          },
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new resume
      resume = await tx.resume.create({
        data: {
          ...resumeValues,
          userId,
          photoUrl: newPhotoUrl,
          workExperiences: {
            create: workExperiences?.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate) : undefined,
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            })),
          },
          Education: {
            create: educations?.map((edu) => ({
              ...edu,
              startDate: edu.startDate ? new Date(edu.startDate) : undefined,
              endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            })),
          },
          Language: {
            create: languages?.map((lang) => ({
              ...lang,
            })),
          },
        },
      });

      // Create payment record only for new resumes
      await tx.payment.create({
        data: {
          userId,
          resumeId: resume.id,
          status: PaymentStatus.PENDING,
          // stripePaymentIntentId will be set later when the checkout session is created
        },
      });
    }

    return resume;
  });
};
