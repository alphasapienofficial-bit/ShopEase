// useLayoutEffect runs before the browser paints, so the page never "jumps".
import { useLayoutEffect } from "react";

export function useLockBodyScroll() {
  useLayoutEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);
}
