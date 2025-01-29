import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface ButtonResumeTobePayedProps {
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";
}

const ButtonResumeTobePayed = ({ status }: ButtonResumeTobePayedProps) => {
  return (
    <Button asChild>
      <Link href={`/resumes?status=${status}`}>
        {status === "SUCCESS" ? "paied" : "pay to download"}
      </Link>
    </Button>
  );
};

export default ButtonResumeTobePayed;
