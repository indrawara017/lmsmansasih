import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBook, FaChartBar, FaUser, FaBell, FaTasks, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/blensasih large.png";

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
        <div className="flex flex-col items-center py-1">
          <img
            src={logo}
            className="w-52 h-52 cursor-pointer"
            alt="Logo"
            onClick={() => {
              navigate("/home");
              onClose();
            }}
          />
        </div>

        <ul className="mt-1 space-y-2">
          {[
            { to: "/home", label: "Mata Pelajaran", icon: <FaBook /> },
            { to: "/nilai-laporan", label: "Nilai & Laporan", icon: <FaChartBar /> },
            { to: "/pengumuman", label: "Pengumuman", icon: <FaBell /> },
            { to: "/jurnal-mengajar", label: "Jurnal Mengajar", icon: <FaTasks /> },
            { to: "/Profile", label: "Profil", icon: <FaUser /> }
          ].map((item) => (
            <li key={item.to} onClick={onClose}>
              <Link
                to={item.to}
                className={`flex items-center space-x-3 p-3 rounded-lg mx-5 transition-colors ${
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
          <button
            className="flex items-center space-x-3 p-3 rounded-lg mx-5 transition-colors"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <FaSignOutAlt />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
