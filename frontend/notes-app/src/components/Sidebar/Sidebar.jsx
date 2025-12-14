import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Sidebar({ isOpen, onClose, userInfo, onLogout, onShowAllNotes }) {
  const [openAI, setOpenAI] = useState(false);
  const navigate = useNavigate();

  return (
    <>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`
          fixed left-0 top-16
          h-[calc(100%-64px)] w-64
          bg-slate-100 text-black p-4 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="space-y-2">

          <SidebarItem label="All Notes" 
            onClick={() => {
              navigate("/dashboard");
              onClose();
            }}
          />
          <Divider />

          <SidebarItem label="Recent" 
            onClick={() => {
              navigate("/recent");
              onClose();
            }}
          />
          <Divider />

          <SidebarItem label="Insights" 
            onClick={() => {
              navigate("/insights");
              onClose();
            }}
          />
          <Divider />

          <button
            onClick={() => setOpenAI(!openAI)}
            className="sidebar-item sidebar-item-hover flex items-center justify-between"
          >
            <span>AI Tools</span>
            <span>{openAI ? "▾" : "▸"}</span>
          </button>

          {openAI && (
            <div className="ml-6 space-y-1">

              <SubItem label="OCR" 
                onClick={() => {
                navigate("/ocr");
                onClose();
              }}/>

              <SubItem label="Voice Notes" 
                onClick={() => {
                navigate("/voice-notes");
                onClose();
              }}/>
            </div>
          )}

          <Divider />
        </nav>

        <button
            onClick={onLogout}
            className="mt-5 w-full text-left px-2 py-0 rounded-lg text-red-900 hover:text-red-700 hover:underline transition"
          >
            Logout
        </button>
      </div>
    </>
  );
}


function SidebarItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="sidebar-item sidebar-item-hover w-full text-left"
    >
      {label}
    </button>
  );
}


function Divider() {
  return <div className="sidebar-divider"></div>;
}

function SubItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="sidebar-subitem sidebar-subitem-hover"
    >
      {label}
    </button>
  );
}
