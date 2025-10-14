import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 mb-6">
      <div className="glass-card mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground flex items-center justify-between">
        <div>
          © 2025 Trade Tide Tracker • v0.9
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="hover:text-foreground">Twitter</a>
          <a href="mailto:support@example.com" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;