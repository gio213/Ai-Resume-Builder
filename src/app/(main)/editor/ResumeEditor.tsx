"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import BreadCrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import { ResumeValuss } from "@/lib/validation";

const ResumeEditor = () => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValuss>();

  const currentStep = searchParams.get("step") ?? steps[0].key;

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
        <h1 className="text-2xl font-bold">Design your resyme</h1>
        <p className="text-sm text-muted-foreground">
          Follow below to create your resume. Yoyr progress will be saved
          automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div className="w-full space-y-6 overflow-y-auto p-3 md:w-1/2">
            <BreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData!}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <div className="hidden w-1/2 md:flex">
            <pre>{JSON.stringify(resumeData, null, 2)}</pre>
          </div>
        </div>
      </main>
      <Footer currentStep={currentStep} setCurrentStep={setStep} />
    </div>
  );
};

export default ResumeEditor;
