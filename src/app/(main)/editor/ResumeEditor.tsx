"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import BreadCrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import { useAutoSaveResume } from "./useAutoSaveResume";
import { useUndloadWarning } from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";

interface ResumeEditorProps {
  resumeToedit: ResumeServerData;
}

const ResumeEditor = ({ resumeToedit }: ResumeEditorProps) => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToedit ? mapToResumeValues(resumeToedit) : {},
  );
  const currentStep = searchParams.get("step") ?? steps[0].key;

  const [showSmResumePreview, setShowSmResumePreview] = useState(false);

  const { hasUnsavedChanges, isSaving } = useAutoSaveResume(resumeData!);

  useUndloadWarning(hasUnsavedChanges);

  const setStep = (step: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", step);
    window.history.pushState(null, "", `?${newSearchParams}`);
  };

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.componnet;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow below to create your resume. Yoyr progress will be saved
          automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              `w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2`,
              showSmResumePreview && "hidden",
            )}
          >
            <BreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData!}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData!}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
          />
        </div>
      </main>
      <Footer
        isSaving={isSaving}
        currentStep={currentStep}
        setCurrentStep={setStep}
        setShowSmResumePreview={setShowSmResumePreview}
        showSmResumePreview={showSmResumePreview}
      />
    </div>
  );
};

export default ResumeEditor;
