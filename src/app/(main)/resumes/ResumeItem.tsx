"use client";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import {
  LockKeyhole,
  MoreVertical,
  Printer,
  Trash2,
  UnlockKeyhole,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState, useTransition } from "react";
import { createCheckoutSession, deleteResume } from "./actions";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

interface ResumeItemProps {
  resume: ResumeServerData;
}

const ResumeItem = ({ resume }: ResumeItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("ResumeItem");

  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <div className="trasnition-colors group relative rounded-lg border border-transparent bg-secondary p-3 hover:border-border">
      <div className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || t("Untitled")}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? `${t("Updated")}` : `${t("Created")}`} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block min-w-full"
        >
          <ResumePreview
            contentRef={contentRef}
            resumeData={mapToResumeValues(resume)}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="from absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      {resume.isPaid ? (
        <MoreMenu resumeId={resume.id} onPrintClick={reactToPrint} />
      ) : (
        <CheckPaiedOrNot resume={resume} />
      )}
    </div>
  );
};

export default ResumeItem;

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

const MoreMenu = ({ resumeId, onPrintClick }: MoreMenuProps) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const t = useTranslations("ResumeItem");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex place-items-center gap-2"
            onClick={() => {
              setShowDeleteConfirmation(true);
            }}
          >
            <Trash2 className="size-4" />
            {t("Delete")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" />
            {t("Print")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmation
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        resumeId={resumeId}
      />
    </>
  );
};

interface DeleteConfirmationProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteConfirmation = ({
  resumeId,
  onOpenChange,
  open,
}: DeleteConfirmationProps) => {
  const [isPending, startTrasition] = useTransition();
  const t = useTranslations("ResumeItem");
  const { toast } = useToast();

  const handleDelete = async () => {
    startTrasition(async () => {
      try {
        await deleteResume(resumeId);
        toast({
          title: "Resume deleted",
          description: "The resume has been deleted successfully",
        });
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to delete resume",
          description: "An error occurred while deleting the resume",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete resume</DialogTitle>
          <DialogDescription>
            {t(
              "This will permanently delete the resume Are you sure you want to",
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {" "}
            {t("Delete")}
          </LoadingButton>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            {t("Cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CheckPaiedOrNot = ({ resume }: ResumeItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePay = async () => {
    try {
      if (!resume.isPaid) {
        const redirectUrl = await createCheckoutSession(resume.id);
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handlePay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant={"ghost"}
      size={"icon"}
      className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
    >
      {!isHovered ? (
        <LockKeyhole className="size-4" />
      ) : (
        <UnlockKeyhole className="size-4" />
      )}
    </Button>
  );
};
