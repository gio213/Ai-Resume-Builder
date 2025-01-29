import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  GenerateWorkExmpereienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparklesIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { generateWorkExperience } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";
import { useTranslations } from "next-intl";

interface GenerateExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

const GenerateExperienceButton = ({
  onWorkExperienceGenerated,
}: GenerateExperienceButtonProps) => {
  const [showInputDialog, setShowInputDialog] = useState(false);

  const t = useTranslations("GenerateExperienceButton");
  return (
    <>
      <Button
        variant={"outline"}
        type="button"
        onClick={() => {
          setShowInputDialog(true);
        }}
      >
        <WandSparklesIcon className="size-4" />
        {t("Smart fill (AI)")}
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={(workExperience) => {
          onWorkExperienceGenerated(workExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
};

export default GenerateExperienceButton;

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void;
}

const InputDialog = ({
  onOpenChange,
  onWorkExperienceGenerated,
  open,
}: InputDialogProps) => {
  const { toast } = useToast();
  const t = useTranslations("GenerateExperienceButton");

  const form = useForm<GenerateWorkExmpereienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (input: GenerateWorkExmpereienceInput) => {
    try {
      const response = await generateWorkExperience(input);
      onWorkExperienceGenerated(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "default",
        description: "Something went wrong. Plese try again",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Generate work experience")}</DialogTitle>
          <DialogDescription>
            {t(
              "Describe this work experience and the AI will generate an optimized entry for you",
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t(
                        "from nov 2019 to dec 2020 I worked at google as a software engineer, my tasks were",
                      )}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              {t("Generate work experience")}
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
