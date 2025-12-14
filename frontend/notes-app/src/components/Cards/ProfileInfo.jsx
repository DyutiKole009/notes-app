import React, { useState, useRef, useEffect } from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
const [open, setOpen] = useState(false);
const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!userInfo) return null;

  return (
    <div ref={ref} className="relative">
  
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full
                   text-black font-medium bg-slate-100 cursor-pointer"
        onClick={() => setOpen((p) => !p)}
        title={userInfo.fullName}
      >
        {getInitials(userInfo.fullName)}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-65 bg-white border
                        rounded-lg shadow-md p-3 z-50">
          <p className="text-sm font-medium">{userInfo.fullName}</p>
          <p className="text-xs text-slate-500">{userInfo.email}</p>

          <p className="text-xs text-slate-400 mt-2">
            Account created on{" "}
            {new Date(userInfo.createdOn).toLocaleDateString("en-GB")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
