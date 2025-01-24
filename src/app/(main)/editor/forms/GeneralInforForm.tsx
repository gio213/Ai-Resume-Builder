import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EdiotrFormProps } from "@/lib/types";
import { useTranslations } from "next-intl";

const GeneralInforForm = ({ resumeData, setResumeData }: EdiotrFormProps) => {
  const t = useTranslations("GeneralInforForm");
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData?.title || "",
      description: resumeData?.description || "",
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
        <h2 className="text-2xl font-semibold">{t("General info")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("This will not appear on your resume")}
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Project name")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("My resume")} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Description")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("A resume for my next job")}
                  />
                </FormControl>
                <FormDescription>
                  {t("Describe what this resume is for")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default GeneralInforForm;
