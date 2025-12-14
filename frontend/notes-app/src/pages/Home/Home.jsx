import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/Cards/EmptyCard";
import axiosInstance from "../../utils/axiosInstance";

import noNotesImg from "../../assets/nonotesimg.jpg";
import notFoundImg from "../../assets/notfoundimg.png";

const Home = () => {
  const { notes, isSearch, refreshNotes } = useOutletContext();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openReadModal, setOpenReadModal] = useState({
    isShown: false,
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const deleteNote = async (note) => {
    await axiosInstance.delete("/delete-note/" + note._id);
    showToastMessage("Note Deleted Successfully", "delete");
    refreshNotes();
  };

  const updateIsPinned = async (note) => {
    await axiosInstance.put("/update-note-pinned/" + note._id, {
      isPinned: !note.isPinned,
    });
    refreshNotes();
  };

  return (
    <>
      <div className="container mx-auto px-6 md:px-10">
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {notes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onOpen={() =>
                  setOpenReadModal({ isShown: true, data: item })
                }
                onEdit={() =>
                  setOpenAddEditModal({
                    isShown: true,
                    type: "edit",
                    data: item,
                  })
                }
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? notFoundImg : noNotesImg}
            message={
              isSearch
                ? "Oops! No notes found matching your search"
                : "Start creating your first note!"
            }
          />
        )}
      </div>

      <button
        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-3xl text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        className="w-[50%] max-h-[80%] bg-white rounded mx-auto mt-14 p-5 overflow-y-auto"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={refreshNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

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

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
