import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBook, FaClipboardList, FaChartBar, FaComments, FaBell, FaTasks, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo2.jpg";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // Jika menggunakan localStorage
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ease-in-out duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center py-6">
          <img
            src={logo}
            className="w-32 h-32 cursor-pointer"
            alt="Logo"
            onClick={() => {
              navigate("/home");
              onClose();
            }}
          />
        </div>

        <ul className="mt-4 space-y-2">
          {[
            { to: "/home", label: "Mata Pelajaran", icon: <FaBook /> },
            { to: "/tugas", label: "Daftar Tugas", icon: <FaClipboardList /> },
            { to: "/nilai-laporan", label: "Nilai & Laporan", icon: <FaChartBar /> },
            { to: "/diskusi", label: "Diskusi", icon: <FaComments /> },
            { to: "/pengumuman", label: "Pengumuman", icon: <FaBell /> },
            { to: "/jurnal-mengajar", label: "Jurnal Mengajar", icon: <FaTasks /> }
          ].map((item) => (
            <li key={item.to} onClick={onClose}>
              <Link
                to={item.to}
                className={`flex items-center space-x-3 p-3 rounded-lg mx-3 transition-colors ${
                  location.pathname === item.to ? "bg-sky-900 text-white" : "hover:bg-gray-200"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol Profil & Logout */}
        <div className="absolute bottom-4 w-full px-3">
          <button className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-400 rounded-lg hover:bg-gray-100" onClick={onClose}>
            <FaCog />
            <span>Profil</span>
          </button>
          <button
            className="w-full mt-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center justify-center space-x-2"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
