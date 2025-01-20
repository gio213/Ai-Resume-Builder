import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveResume } from "./actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export const useAutoSaveResume = (resumeData: ResumeValues) => {
  const searchParams = useSearchParams();

  const { toast } = useToast();

  const [resumeId, setResumeId] = useState(resumeData?.id);

  const deboucedResumeData = useDebounce(resumeData, 1500);

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [deboucedResumeData]);

  useEffect(() => {
    const save = async () => {
      try {
        setIsSaving(true);
        setIsError(false);
        const newData = structuredClone(deboucedResumeData);
        const updatedData = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData?.photo, fileReplacer!) ===
            JSON.stringify(newData?.photo, fileReplacer!) && {
            photo: undefined,
          }),
          id: resumeId,
        });
        setResumeId(updatedData.id);
        setLastSavedData(newData);

        if (searchParams.get("resumeId") !== updatedData.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedData.id);
          window.history.replaceState(null, "", `?${newSearchParams}`);
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes...</p>
              <Button
                variant={"secondary"}
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    };

    const hasUnsavedChanges =
      JSON.stringify(deboucedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && deboucedResumeData && !isSaving && !isError) {
      save();
    }
  }, [
    deboucedResumeData,
    isError,
    isSaving,
    lastSavedData,
    resumeId,
    searchParams,
    toast,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(deboucedResumeData) !== JSON.stringify(lastSavedData),
  };
};
