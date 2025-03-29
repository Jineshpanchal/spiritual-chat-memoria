
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const links = [
    { to: "/", label: "Chat", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { to: "/mood-tracker", label: "Mood Tracker", icon: <Calendar className="h-4 w-4 mr-2" /> }
  ];

  return (
    <div className={`border-b ${isMobile ? 'px-2 py-2' : 'px-4 py-2'}`}>
      <div className="flex items-center justify-between">
        <div className="font-semibold text-primary text-lg">Spiritual Journey</div>
        
        <nav className="flex items-center gap-2">
          {links.map((link) => (
            <Button
              key={link.to}
              variant={location.pathname === link.to ? "default" : "ghost"}
              size={isMobile ? "sm" : "default"}
              asChild
            >
              <Link to={link.to} className="flex items-center">
                {link.icon}
                {isMobile ? null : link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
