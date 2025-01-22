"use client";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState, useTransition } from "react";
import { deleteResume } from "./actions";
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

interface ResumeItemProps {
  resume: ResumeServerData;
}

const ResumeItem = ({ resume }: ResumeItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

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
            {resume.title || "Not title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
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
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrint} />
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
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" />
            Print
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
  const { toast } = useToast();
  const [isPending, startTrasition] = useTransition();

  const handleDelete = async () => {
    startTrasition(async () => {
      try {
        await deleteResume(resumeId);
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast({
          variant: "default",
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
            This will permanently delete the resume. Are you sure you want to
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            loading={isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {" "}
            Delete
          </LoadingButton>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
