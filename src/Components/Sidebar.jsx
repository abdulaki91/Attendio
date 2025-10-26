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
import ThemeSelector from "./ThemeController";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation(); // get current pathname
  const [visible, setVisible] = useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      path: "/dashboard",
    },
    { name: "Student", icon: <User size={16} />, path: "/student" },
    {
      name: "Sessions",
      icon: <CalendarCheck size={16} />,
      path: "/session-attendance",
    },
    { name: "Attendance", icon: <UserCheck size={16} />, path: "/attendance" },
    { name: "Settings", icon: <Settings size={16} />, path: "/settings" },
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
    <div className="flex container bg-base-100 text-base-content min-w-full">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 z-40
          ${isOpen ? "w-26 sm:w-38 lg:w-64" : "w-0 lg:w-64"} 
          overflow-hidden bg-base-200`}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border-b border-base-300 gap-2">
          <h1
            className="text-secondary font-bold cursor-pointer"
            onClick={() => handleNavigation("/dashboard")}
          >
            Attendio
          </h1>
          {/* Close button on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-base-content"
          >
            <X size={15} className="hover:text-error" color="red" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-8 flex flex-col justify-between h-[calc(100%-4rem)] sm:p-1 lg:p-4 border-base-200 w-max">
          <div className="w-max flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center gap-1 px-2 py-1  transition rounded-md
                  ${
                    location.pathname === item.path
                      ? "bg-base-100 font-bold text-primary md:px-4 px-2"
                      : "hover:bg-base-300"
                  }`}
              >
                {item.icon}
                <span className="truncate text-[13px] sm:text-sm lg:text-base w-max">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
          {/* User Info placeholder */}
        </nav>
      </div>

      {/* Main Content + Navbar */}
      <div className="flex-1 lg:ml-64 w-full ">
        <div className="p-2 h-10">
          {/* {visible && !isOpen && (
            <div className="p-2 md:p-3 lg:p-4 mb-2 text-xs sm:text-sm md:textarea-md bg-base-100 rounded-lg shadow-md border border-base-300 relative m-auto w-full">
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
                className="flex items-center cursor-pointer gap-2 px-4 py-2 w-full  font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-all shadow"
              >
                <HelpCircle size={18} className="text-white" />
                <span>User Guide</span>
              </button>
            </div>
          )} */}
          {/* <Navbar /> */}
        </div>
      </div>
    </div>
  );
}
