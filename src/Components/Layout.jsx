import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-24 md:ml-40 sm:ml-32 lg:ml-64" : "lg:ml-64"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
