import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { useTranslations } from "next-intl";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  className?: string;
  contentRef?: React.Ref<HTMLDivElement>;
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
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <LanguageSection resumeData={resumeData} />
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
  const t = useTranslations("ResumePreview");

  if (!resumeData) return null;
  const { summary, colorHex } = resumeData;
  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="breka-in break-inside-avoid space-y-3">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          {t("Professional profile")}
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
};

const WorkExperienceSection = ({ resumeData }: ResumeSectionProps) => {
  const t = useTranslations("ResumePreview");
  if (!resumeData) return null;
  const { workExperiences, colorHex } = resumeData;

  const workEperiencesEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (workEperiencesEmpty?.length === 0) return null;

  return (
    <>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="text-lg font-semibold"
          style={{
            color: colorHex,
          }}
        >
          {t("Work experience")}
        </p>
        {workExperiences?.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{
                color: colorHex,
              }}
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate
                    ? formatDate(exp.endDate, "MM/yyyy")
                    : t("Present")}
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
  const t = useTranslations("ResumePreview");
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
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          {t("Education")}
        </p>
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
                    ` ${formatDate(edu.startDate, "MM/yyyy")} ${
                      edu.endDate
                        ? `- ${formatDate(edu.endDate, "MM/yyyy")}`
                        : `- ${t("Present")}`
                    }`}
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

const LanguageSection = ({ resumeData }: ResumeSectionProps) => {
  const t = useTranslations("LangugageForm");

  if (!resumeData) return null;
  const { languages, colorHex } = resumeData;

  if (!languages || languages.length === 0) return null;

  return (
    <section style={{ padding: "0.5rem 0" }}>
      <h3
        style={{
          color: colorHex || "#333",
          marginBottom: "0.5rem",
          fontSize: "1.2rem",
        }}
      >
        {t("Languages")}
      </h3>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        {languages.map((lang, index) => (
          <li key={index} style={{ fontSize: "0.9rem", color: "#555" }}>
            <strong>{lang.languageName}:</strong>{" "}
            {lang.languageLevel === "Native" ? t("Native") : lang.languageLevel}
          </li>
        ))}
      </ul>
    </section>
  );
};

const SkillsSection = ({ resumeData }: ResumeSectionProps) => {
  const t = useTranslations("ResumePreview");
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
          {t("Skills")}
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              className="text-customTextForSkills"
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
