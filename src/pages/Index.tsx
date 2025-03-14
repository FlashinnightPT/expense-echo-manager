
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Dashboard from "@/components/layout/Dashboard";

const Index = () => {
  // Smooth loading animation
  useEffect(() => {
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease-in-out";
      document.body.style.opacity = "1";
    }, 100);
    
    return () => {
      document.body.style.transition = "";
      document.body.style.opacity = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Dashboard />
    </div>
  );
};

export default Index;
