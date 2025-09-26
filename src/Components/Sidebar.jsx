import { useState } from "react";
import { X, LayoutDashboard, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
export default function Sidebar({ isOpen, setIsOpen }) {
  const [active, setActive] = useState("Dashboard");
  const navigate = useNavigate();
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "Student", icon: <User size={20} />, path: "/student" },
    { name: "Attendance", icon: <User size={20} />, path: "/attendance" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleNavigation = (item) => {
    setActive(item.name);
    navigate(item.path);
    setIsOpen(false);
  };

  return (
    <div className="flex container bg-base-100 text-base-content">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 z-40
    ${isOpen ? "w-24 sm:w-40 lg:w-64" : "w-0 lg:w-64"} 
    overflow-hidden bg-base-200`}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-base font-bold">Attendio</h1>
          {/* Close only on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-base-content"
          >
            <X size={20} className="hover:text-error" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-8 flex flex-col justify-between h-[calc(100%-4rem)]">
          <div>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className={`flex items-center gap-3 px-4 py-2 w-full text-sm transition rounded-md
              ${
                active === item.name
                  ? "bg-base-300 font-medium"
                  : "hover:bg-base-300"
              }`}
              >
                {item.icon}
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>

          {/* User Info */}
        </nav>
      </div>

      {/* Main Content + Navbar */}
      <div className="flex-1 lg:ml-64">
        <div className="navbar bg-base-100 shadow-sm px-4">
          {/* Hamburger (only on mobile/tablet) */}
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-sm lg:hidden"
          >
            {/* DaisyUI already ships with an icon, but using Lucide is fine */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Your <Navbar /> component or page content can go here */}
        <Navbar />
      </div>
    </div>
  );
}
