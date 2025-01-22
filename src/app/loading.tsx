import React from "react";
import { Spinner } from "@/components/Spinner";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="mx-auto my-6" />
    </div>
  );
};

export default Loading;
