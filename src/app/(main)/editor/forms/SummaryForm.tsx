import { EdiotrFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import GenerateSummaryBtn from "./GenerateSummaryBtn";
import { useTranslations } from "next-intl";
const SummaryForm = ({ resumeData, setResumeData }: EdiotrFormProps) => {
  const t = useTranslations("SummaryForm");
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData?.summary || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({ ...resumeData, ...values });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">{t("Professional summary")}</h2>
        <p className="text-sm text-muted-foreground">
          {t(
            "Write a short introduction about your resume or let the AI generate one from your entry data",
          )}
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  {t("Professional summary")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("A brief, engaging text about yourself")}
                  />
                </FormControl>
                <FormMessage />
                <GenerateSummaryBtn
                  resumeData={resumeData}
                  onSumarryGenerated={(summary) =>
                    form.setValue("summary", summary)
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default SummaryForm;
