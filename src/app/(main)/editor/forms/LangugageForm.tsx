import { Button } from "@/components/ui/button";
import { EdiotrFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageValues, langugageSchema } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const LangugageForm = ({ resumeData, setResumeData }: EdiotrFormProps) => {
  const t = useTranslations("LangugageForm");
  const form = useForm<LanguageValues>({
    resolver: zodResolver(langugageSchema),
    defaultValues: {
      languages: resumeData?.languages || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setResumeData({
        ...resumeData,
        languages: values.languages?.filter((lang) => lang !== undefined),
      });
    });
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "languages",
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
        <h2 className="text-2xl font-semibold">{t("Language")}</h2>
        <p className="text-sm text-muted-foreground">{t("Add language")}</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            onDragEnd={handleDrugEnd}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <LangugageItem
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
                  languageLevel: "",
                  languageName: "",
                })
              }
            >
              Add Language
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LangugageForm;

interface LangugageItemProps {
  id: string;
  form: UseFormReturn<LanguageValues>;
  index: number;
  remove: (index: number) => void;
}

const LangugageItem = ({ form, id, index, remove }: LangugageItemProps) => {
  const t = useTranslations("LangugageForm");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const languageLevels = ["Native", "A1", "A2", "B1", "B2", "C1", "C2"];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        `space-y-3 rounded-md border bg-background p-3`,
        isDragging && "relative z-50 cursor-grab shadow-md",
      )}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">
          {t("Language")} {index + 1}{" "}
        </span>
        <GripHorizontal
          {...attributes}
          {...listeners}
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
        />
      </div>

      <FormField
        control={form.control}
        name={`languages.${index}.languageName`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Language")}</FormLabel>
            <Input {...field} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`languages.${index}.languageLevel`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Level")}</FormLabel>
            <div className="flex items-center gap-2">
              {languageLevels.map((level) => (
                <Badge
                  className={
                    field.value === level
                      ? "bg-primary text-white"
                      : "cursor-pointer hover:bg-primary hover:text-white"
                  }
                  onSelect={(level) => field.onChange(level)}
                  onClick={() => field.onChange(level)}
                  key={level}
                  variant="secondary"
                >
                  {level === "Native" ? t("Native") : level}
                </Badge>
              ))}
            </div>
          </FormItem>
        )}
      />

      <Button
        variant={"destructive"}
        type="button"
        onClick={() => remove(index)}
      >
        {t("Remove")}
      </Button>
    </div>
  );
};
