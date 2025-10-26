// import { useState } from "react";
import {
  X,
  LayoutDashboard,
  User,
  Settings,
  CalendarCheck,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation(); // get current pathname
  const [visible, setVisible] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "Student", icon: <User size={20} />, path: "/student" },
    {
      name: "Session Attendance",
      icon: <CalendarCheck size={20} />,
      path: "/session-attendance",
    },
    { name: "Attendance", icon: <UserCheck size={20} />, path: "/attendance" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };
  // / Persist dismissal in localStorage

  const handleDismiss = () => {
    setVisible((prev) => !prev);
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
          <h1
            className="text-base font-bold cursor-pointer"
            onClick={() => handleNavigation("/dashboard")}
          >
            Attendio
          </h1>
          {/* Close button on mobile */}
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
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-3 px-4 py-2 w-full text-sm transition rounded-md
                  ${
                    location.pathname === item.path
                      ? "bg-base-300 font-medium"
                      : "hover:bg-base-300"
                  }`}
              >
                {item.icon}
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>
          {/* User Info placeholder */}
        </nav>
      </div>

      {/* Main Content + Navbar */}
      <div className="flex-1 lg:ml-64">
        <div className="navbar bg-base-100 shadow-sm px-4">
          {visible && (
            <div className="p-4 mb-4 bg-base-100 rounded-lg shadow-md border border-base-300 relative m-auto">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
              <h1 className="text-lg font-bold text-primary mb-1">
                Need Help?
              </h1>
              <p className="text-xs text-gray-500 mb-2">
                Learn how to signup, start a session, and mark attendance.
              </p>
              <button
                onClick={() => navigate("/help")}
                className="flex items-center gap-2 px-4 py-2 w-full text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-all shadow"
              >
                <HelpCircle size={18} className="text-white" />
                <span>User Guide</span>
              </button>
            </div>
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-sm lg:hidden"
          >
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
        <Navbar />
      </div>
    </div>
  );
}
