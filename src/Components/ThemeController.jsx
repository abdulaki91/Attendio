// ThemeSelector.jsx
import React, { useState, useEffect } from "react";
import Select from "./Select";

const themes = ["light", "dark", "dracula", "forest", "coffee", "dim", "nord"];

export default function ThemeSelector() {
  // Load saved theme from localStorage or default to 'dracula'
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dracula"
  );

  useEffect(() => {
    // Apply theme to <html> for DaisyUI
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // save preference
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <Select
        options={themes}
        allowOther={false}
        label="Theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      />
    </div>
  );
}
