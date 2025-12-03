import { useEffect, useRef } from "react";

export const SkipToContent = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !e.shiftKey) {
        linkRef.current?.focus();
      }
    };

    // Only add listener on initial load
    window.addEventListener("keydown", handleKeyDown, { once: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <a
      ref={linkRef}
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      onClick={(e) => {
        e.preventDefault();
        const main = document.getElementById("main-content");
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      Skip to main content
    </a>
  );
};
