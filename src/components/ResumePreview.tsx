import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
  contentRef?: React.RefObject<HTMLDivElement>;
}

const ResumePreview = ({
  resumeData,
  className,
  contentRef,
}: ResumePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimensions(
    containerRef as React.RefObject<HTMLDivElement>,
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "text-text-primary aspect-[210/297] h-fit w-full bg-background",
        className,
      )}
    >
      <div
        ref={contentRef}
        style={{ zoom: (1 / 794) * width }}
        className={cn("space-y-6 p-6", !width && "invisible")}
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
};

export default ResumePreview;

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

const PersonalInfoHeader = ({ resumeData }: ResumeSectionProps) => {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const borderRadiusClass =
    borderStyle === "squircle"
      ? "rounded-lg"
      : borderStyle === "circle"
        ? "rounded-full"
        : "rounded-none";

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          loader={({ src }) => src}
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className={`aspect-square object-cover ${borderRadiusClass}`}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </p>
          <p style={{ color: colorHex }} className="font-medium">
            {jobTitle}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          {city} {city && country && ", "} {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
};

const SummarySection = ({ resumeData }: ResumeSectionProps) => {
  if (!resumeData) return null;
  const { summary, colorHex } = resumeData;
  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="breka-in break-inside-avoid space-y-3">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Professional profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
};

const WorkExperienceSection = ({ resumeData }: ResumeSectionProps) => {
  if (!resumeData) return null;
  const { workExperiences, colorHex } = resumeData;

  const workEperiencesEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (workEperiencesEmpty?.length === 0) return null;

  return (
    <>
      <hr style={{ borderColor: colorHex }} className="border-2" />
      <div className="space-y-3">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Work experiences
        </p>
        {workExperiences?.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              style={{ color: colorHex }}
              className="flex items-center justify-between text-sm font-semibold"
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MMM yyyy")} -
                  {exp.endDate
                    ? formatDate(exp.endDate, "MMM yyyy")
                    : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </>
  );
};

const EducationSection = ({ resumeData }: ResumeSectionProps) => {
  if (!resumeData) return null;

  const { educations, colorHex } = resumeData;

  const educationsEmpty = educations?.filter(
    (education) => Object.values(education).filter(Boolean).length > 0,
  );

  if (educationsEmpty?.length === 0) return null;

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p className="text-lg font-semibold">Education</p>
        {educations?.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              style={{ color: colorHex }}
              className="flex items-center justify-between text-sm font-semibold"
            >
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MMM yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MMM yyyy")}` : ""}`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.shcool}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const SkillsSection = ({ resumeData }: ResumeSectionProps) => {
  if (!resumeData) return null;
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills || skills.length === 0) return null;

  const borderRadiusClass =
    borderStyle === "sqaure"
      ? "0px"
      : borderStyle === "circle"
        ? "9999px"
        : "8px";

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              style={{
                backgroundColor: colorHex,
                borderRadius: borderRadiusClass,
              }}
              key={index}
            >
              {" "}
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};
