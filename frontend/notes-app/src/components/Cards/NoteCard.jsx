import React from "react";
import moment from "moment";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  onOpen,
}) => {
  return (
    <div
      onClick={onOpen}
      className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out cursor-pointer"
    >

      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn cursor-pointer ${
            isPinned ? "text-blue-600" : "text-slate-300"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onPinNote();
          }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-700 break-words line-clamp-3">
        {content}
      </p>

      <div className="flex items-center justify-between mt-3">

        <div className="text-xs text-slate-500 flex flex-wrap gap-2">
          {tags.map((item, index) => (
            <span key={index}>#{item}</span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
