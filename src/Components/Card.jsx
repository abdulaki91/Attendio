import React from "react";

export default function Card({ title, value, icon }) {
  return (
    <div className="flex items-center justify-center  flex-col w-full md:w-max lg:w-64 p-2 bg-base-300  rounded-lg gap-4 mt-6 text-xs md:text-sm">
      <div className="flex items-center gap-5 px-2">
        {icon}
        <div>
          <p>{title}</p>
          <p className="font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
