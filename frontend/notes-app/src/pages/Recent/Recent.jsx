import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "react-modal";
import EmptyCard from "../../components/Cards/EmptyCard";

const Recent = () => {
  const { notes } = useOutletContext();

  const [filter, setFilter] = useState("7");
  const [recentNotes, setRecentNotes] = useState([]);

  const [openReadModal, setOpenReadModal] = useState({
    isShown: false,
    data: null,
  });

  useEffect(() => {
    if (!notes || notes.length === 0) {
      setRecentNotes([]);
      return;
    }

    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - Number(filter));

    const filtered = notes
      .filter(note => {
        const lastUpdated = new Date(note.updatedOn || note.createdOn);
        return lastUpdated >= fromDate;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedOn || b.createdOn) -
          new Date(a.updatedOn || a.createdOn)
      );

    setRecentNotes(filtered);
  }, [notes, filter]);

  return (
    <>
      <div className="container mx-auto px-6 md:px-10 mt-6">

        <h1 className="text-2xl font-semibold mb-1">Recent Notes</h1>
        <p className="text-sm text-slate-500 mb-6">
          Notes created or edited recently
        </p>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("7")}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              filter === "7"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            Last 7 days
          </button>

          <button
            onClick={() => setFilter("30")}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              filter === "30"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            Last 30 days
          </button>
        </div>

        {recentNotes.length > 0 ? (
          <ul className="divide-y border rounded-lg bg-white">
            {recentNotes.map(note => (
              <li
                key={note._id}
                onClick={() =>
                  setOpenReadModal({ isShown: true, data: note })
                }
                className="p-4 cursor-pointer hover:bg-slate-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{note.title}</h3>

                  {note.isPinned && (
                    <span className="text-xs text-blue-600 font-semibold">
                      PINNED
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 line-clamp-1 mt-1">
                  {note.content}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Last updated{" "}
                  {new Date(note.updatedOn || note.createdOn).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyCard
            message={`No notes created or edited in the last ${filter} days`}
          />
        )}
      </div>

      <Modal
        isOpen={openReadModal.isShown}
        onRequestClose={() =>
          setOpenReadModal({ isShown: false, data: null })
        }
        className="w-[60%] max-h-[80%] bg-white rounded mx-auto mt-14 p-6 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black/30"
      >
        {openReadModal.data && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              {openReadModal.data.title}
            </h2>

            <p className="text-xs text-slate-500 mb-4">
              {new Date(openReadModal.data.createdOn).toDateString()}
            </p>

            <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">
              {openReadModal.data.content}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {openReadModal.data.tags.map((tag, i) => (
                <span key={i} className="text-xs text-blue-600">
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default Recent;
