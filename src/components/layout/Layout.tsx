import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main 
        id="main-content" 
        className="flex-1" 
        role="main"
        tabIndex={-1}
        aria-label="Main content"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};
