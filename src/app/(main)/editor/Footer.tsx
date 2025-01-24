import { Button } from "@/components/ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUser, PenLineIcon } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import { useTranslations } from "next-intl";

interface FooterProps {
  isSaving: boolean;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowSmResumePreview: (show: boolean) => void;
}

export default function Footer({
  currentStep,
  setCurrentStep,
  setShowSmResumePreview,
  showSmResumePreview,
  isSaving,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            {t("Previous step")}
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            {t("Next step")}
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          title={
            showSmResumePreview ? "Hide resume preview" : "Show resume preview"
          }
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUser />}
        </Button>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary">
            {isSaving ? (
              <Spinner className="text-primary" />
            ) : (
              <Link href="/resumes">{t("Close")}</Link>
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
}
