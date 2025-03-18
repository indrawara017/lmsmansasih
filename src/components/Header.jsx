import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ onToggleSidebar, currentPath }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  if (currentPath === "/login") return null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-gray-100 shadow-md">
      <button className="text-gray-700 text-2xl" onClick={onToggleSidebar}>
        <FaBars />
      </button>
      <div className="flex-col">
      <h1 className="text-gray-700 text-2xl font-semibold text-center" style={{ fontFamily: "'Black Ops One', reguler" }}>
        <span className="font-bold">SIBLENDIS</span>
      </h1>
      {/* <h1 className="text-gray-700 text-x font-semibold text-center" style={{ fontFamily: "'Black Ops One', reguler" }}>
        <span className="font-bold">SISTEM INTEGRASI BLENDED LEARNING </span>
      </h1> */}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full shadow-sm"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FaPlus className="text-blue-500" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border">
            <button
              onClick={() => navigate("/tambah-kelas")}
              className="w-full px-4 py-2 text-left hover:bg-gray-200 text-gray-700"
            >
              Membuat Kelas
            </button>
            <button
              onClick={() => navigate("/gabung-kelas")}
              className="w-full px-4 py-2 text-left hover:bg-gray-200 text-gray-700"
            >
              Gabung Kelas
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
