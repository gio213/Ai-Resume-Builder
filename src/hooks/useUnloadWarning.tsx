import { useEffect } from "react";

export const useUndloadWarning = (condition = false) => {
  useEffect(() => {
    if (!condition) return;
    const listiner = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", listiner);
    return () => window.removeEventListener("beforeunload", listiner);
  }, [condition]);
};
