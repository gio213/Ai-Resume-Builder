import { EdiotrFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperiencesValues } from "@/lib/validation";
import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GripHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragEndEvent,
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import GenerateExperienceButton from "./GenerateExperienceButton";
import { useTranslations } from "next-intl";

const WorkExperienceForm = ({ resumeData, setResumeData }: EdiotrFormProps) => {
  const t = useTranslations("WorkExperienceForm");
  const form = useForm<WorkExperiencesValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData?.workExperiences || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        workExperiences: values.workExperiences?.filter(
          (exp) => exp !== undefined,
        ),
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDrugEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-x-1.5 text-center">
        <h2 className="text-2xl font-semibold">{t("Work experience")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("Add as many work experiences as you like")}
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDrugEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <WorkExperienceItems
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                })
              }
            >
              {t("Add work experience")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkExperienceForm;

interface WorkExperienceItemsProps {
  id: string;
  form: UseFormReturn<WorkExperiencesValues>;
  index: number;
  remove: (index: number) => void;
}

const WorkExperienceItems = ({
  form,
  index,
  remove,
  id,
}: WorkExperienceItemsProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const t = useTranslations("WorkExperienceForm");

  return (
    <div
      style={{ transform: CSS.Transform.toString(transform), transition }}
      ref={setNodeRef}
      className={cn(
        `space-y-3 rounded-md border bg-background p-3`,
        isDragging && "relative z-50 cursor-grab shadow-md",
      )}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">
          {t("Work experience")} {index + 1}{" "}
        </span>
        <GripHorizontal
          {...attributes}
          {...listeners}
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
        />
      </div>
      <div className="flex justify-center">
        <GenerateExperienceButton
          onWorkExperienceGenerated={(exp) =>
            form.setValue(`workExperiences.${index}`, exp)
          }
        />
      </div>
      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Job title")}</FormLabel>
            <Input {...field} autoFocus />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Company")}</FormLabel>
            <Input {...field} />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Start date")}</FormLabel>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`workExperiences.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("End date")}</FormLabel>
              <Input {...field} type="date" value={field.value?.slice(0, 10)} />
            </FormItem>
          )}
        />
        <FormDescription>
          {t("Leave")} <span className="font-semibold"> {t("End date")} </span>
          {t("empty if you currently work here")}
        </FormDescription>
      </div>
      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Description")}</FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />
      <Button
        variant={"destructive"}
        type="button"
        onClick={() => remove(index)}
      >
        {t("Remove work experience")}
      </Button>
    </div>
  );
};
