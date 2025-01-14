import { Metadata } from "next";
import React from "react";
import ResumeEditor from "./ResumeEditor";

export const metadata: Metadata = {
  title: "Design your resume",
};

const page = () => {
  return <ResumeEditor />;
};

export default page;
