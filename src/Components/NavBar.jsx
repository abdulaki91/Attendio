import React from "react";
import { Menu } from "lucide-react";
import ThemeSelector from "../Components/ThemeController"; // Assuming you have a ThemeSelector component
export default function Navbar({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-base-200 container">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-700 dark:text-gray-300"
      >
        <Menu size={24} />
      </button>

      {/* Navbar Right Side */}
      <div className="flex justify-end w-full">
        <div className="mx-4 flex gap-2 items-center justify-center">
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}
