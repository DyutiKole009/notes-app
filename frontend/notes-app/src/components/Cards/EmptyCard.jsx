import React from "react";

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">

      <img
        src={imgSrc}
        alt="No notes"
        className="w-64 md:w-72 mb-6"
      />

      <p className="max-w-xl text-sm md:text-base font-medium text-slate-500 text-center leading-7">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
