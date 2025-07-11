import React from "react";

export default function Alert(props) {
  return (
    <div>
      <div className="bg-[#23243a] text-white rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-4 border-l-4 border-[#ff5c35] shadow-md flex items-center text-sm sm:text-base" role="alert">
        {props.message}
      </div>
    </div>
  );
}
