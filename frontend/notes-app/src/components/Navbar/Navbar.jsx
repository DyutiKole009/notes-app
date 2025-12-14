import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, onMenuClick, showSearch }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
  <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow fixed top-0 left-0 w-full z-40">

    <div className="flex items-center gap-2">  
      {userInfo &&
      <button 
        className="text-xl"
        onClick={onMenuClick}
      >
        ☰
      </button>}
      <h2 className="text-xl font-medium text-black">Notes</h2>
    </div>

    {showSearch && userInfo && 
    <SearchBar 
      value={searchQuery}
      onChange={({ target }) => setSearchQuery(target.value)}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
    />}

    {userInfo && 
    <ProfileInfo
      userInfo={userInfo}
      onLogout={() => {
        localStorage.clear();
        navigate("/login");
      }}
    />}

  </div>
);

}

export default Navbar;
