import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const DashboardLayout = ({ setIsLoggedIn }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  /* ---------------- GET USER ---------------- */
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/get-user");
        setUserInfo(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user", err);
        handleLogout(); // 🔥 force logout on token failure
      }
    };

    fetchUser();
  }, [token]);

  /* ---------------- NOTES ---------------- */
  const getAllNotes = async () => {
    const res = await axiosInstance.get("/get-all-notes");
    setNotes(res.data.note || []);
  };

  const onSearchNote = async (query) => {
    const res = await axiosInstance.get("/search-notes", {
      params: { query },
    });
    setIsSearch(true);
    setNotes(res.data.notes || []);
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    if (token) getAllNotes();
  }, [token]);

  const handleLogout = () => {
  localStorage.clear();      // storage
  setIsLoggedIn(false);      // 🔥 React state (MANDATORY)
  navigate("/login", { replace: true });
};


  const isDashboard = location.pathname.includes("dashboard");

  return (
    <>
      {token && (
        <Navbar
          userInfo={userInfo}
          onMenuClick={() => setSidebarOpen((p) => !p)}
          showSearch={isDashboard}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
          setIsLoggedIn={setIsLoggedIn}   // 🔥 PASS DOWN
        />
      )}

      {token && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
          navigate={navigate}
        />
      )}

      <div className="mt-20 px-6 md:px-10">
        <Outlet context={{ notes, isSearch, refreshNotes: getAllNotes }} />
      </div>
    </>
  );
};

export default DashboardLayout;
