import React from "react";
import { Fish } from "lucide-react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-card mx-auto max-w-6xl mt-3 mb-6 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <Fish className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">Trade Tide Tracker</span>
        </Link>
        <span className="ml-auto text-xs text-muted-foreground">v0.9 • Make smarter trades</span>
      </div>
    </header>
  );
};

export default Header;