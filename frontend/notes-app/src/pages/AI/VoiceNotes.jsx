import React, { useState, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance"; // adjust path if needed
import Toast from "../../components/ToastMessage/Toast";

const VoiceNotes = () => {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

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

  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToastMessage("Speech Recognition not supported", "delete");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setText((prev) => prev + transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      showToastMessage("Recording error", "delete");
    };

    recognition.onend = () => {
      setListening(false);
    };

    return recognition;
  };

  const startRecording = () => {
    const recognition = initRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const handleAddNote = async () => {
    if (!text.trim()) {
      showToastMessage("Content is required", "delete");
      return;
    }

    try {
      const response = await axiosInstance.post("/add-note", {
        title: "Voice Note",
        content: text,
        tags: ["voice"],
      });

      if (response.data && response.data.note) {
        showToastMessage("Note added successfully", "add");
        setText("");
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
        <h2 className="text-2xl font-semibold mb-4">Voice Notes</h2>

        <div className="flex gap-3 mb-4">
          {!listening ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Stop Recording
            </button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your speech will appear here..."
          className="w-full h-48 p-3 border rounded bg-slate-50"
        />

        <button
          onClick={handleAddNote}
          className="btn-primary mt-4"
        >
          Add to Notes
        </button>
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

export default VoiceNotes;