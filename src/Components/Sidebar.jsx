import React, { useState } from "react";
import { X, LayoutDashboard, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/NavBar";

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
    <div className="flex container bg-base-200">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 z-40
        ${
          isOpen ? "w-24 md:w-40 sm:w-32 lg:w-64" : "w-0 lg:w-64"
        } overflow-hidden text-xs sm:text-sm`}
      >
        {/* Logo */}
        <div className="flex items-center  justify-between p-4  ">
          <h1 className="text-sm sm:text-sm font-bold ">Attendio</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray- text-sm dark:text-gray-300"
          >
            <X size={20} className="hover:text-red-500 text-sm" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-16 flex flex-col justify-between h-[calc(100%-4rem)]">
          <div>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 w-full text-left transition
                  ${
                    active === item.name
                      ? "bg-base-300 dark:bg-gray-800  "
                      : " hover:bg-base-300  dark:hover:bg-gray-600"
                  }`}
              >
                {item.icon}
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>

          {/* User Info */}
          <div className="p-4 flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <img
              src="https://i.pravatar.cc/40"
              alt="User Avatar"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <div className="truncate">
              <p className="font-medium text-gray-800 dark:text-white">
                John Doe
              </p>
              <p className="text-gray-500 dark:text-gray-400 truncate">
                john.doe@email.com
              </p>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content + Navbar */}
      <div className="flex-1 lg:ml-64">
        <Navbar onMenuClick={() => setIsOpen(true)} />
      </div>
    </div>
  );
}
