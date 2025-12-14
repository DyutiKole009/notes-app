import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axiosInstance from "../../utils/axiosInstance"; // adjust path if needed
import Toast from "../../components/ToastMessage/Toast";

const OCR = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const showToastMessage = (message, type = "add") => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);

    try {
      const result = await Tesseract.recognize(file, "eng");
      setText(result.data.text);
    } catch (err) {
      showToastMessage("Failed to extract text", "delete");
    }

    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!text.trim()) {
      showToastMessage("Content is required", "delete");
      return;
    }

    try {
      const response = await axiosInstance.post("/add-note", {
        title: "OCR Note",
        content: text,
        tags: ["ocr"],
      });

      if (response.data && response.data.note) {
        showToastMessage("Note added successfully", "add");
        setText("");
        setImage(null);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showToastMessage(error.response.data.message, "delete");
      } else {
        showToastMessage("Internal Server Error", "delete");
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-6 md:px-10 mt-20 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">OCR (Image → Text)</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />

        {image && (
          <img
            src={image}
            alt="Uploaded"
            className="max-h-64 mb-4 border rounded"
          />
        )}

        {loading && (
          <p className="text-blue-500 mb-3">Extracting text...</p>
        )}

        {text && (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-3 border rounded bg-slate-50"
            />

            <button
              onClick={handleAddNote}
              className="btn-primary mt-4"
            >
              Add to Notes
            </button>
          </>
        )}
      </div>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default OCR;
