import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import React, { useState } from "react";
import { generateSummary } from "./actions";

interface GenerateSummaryBtnProps {
  resumeData: ResumeValues;
  onSumarryGenerated: (summary: string) => void;
}

const GenerateSummaryBtn = ({
  onSumarryGenerated,
  resumeData,
}: GenerateSummaryBtnProps) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // todo : block for non premium users

    try {
      setLoading(true);
      const aiResponse = await generateSummary(resumeData);
      onSumarryGenerated(aiResponse);
    } catch (error) {
      console.error("Failed to generate summary", error);
      toast({
        variant: "destructive",
        description: "Failed to generate summary",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="outline"
      type="button"
      onClick={handleClick}
      loading={loading}
    >
      <WandSparklesIcon className="size-4" />
      Generate (AI)
    </LoadingButton>
  );
};

export default GenerateSummaryBtn;
