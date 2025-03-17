import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBook, FaClipboardList, FaChartBar, FaComments, FaBell, FaCalendar, FaTasks, FaCog } from "react-icons/fa";
import logo from "../assets/logo4.jpg";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-70 bg-white shadow-lg transition-transform duration-300 overflow-hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center py-5 mt-10">
        <img src={logo} className="w-32 h-32" alt="Logo" />
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-2">
        {[
          { to: "/home", label: "Mata Pelajaran", icon: <FaBook /> },
          { to: "/tugas", label: "Daftar Tugas", icon: <FaClipboardList /> },
          { to: "/nilai-laporan", label: "Nilai & Laporan", icon: <FaChartBar /> },
          { to: "/diskusi", label: "Diskusi", icon: <FaComments /> },
          { to: "/pengumuman", label: "Pengumuman", icon: <FaBell /> },
          { to: "/kalender", label: "Kalender", icon: <FaCalendar /> },
          { to: "/jurnal-mengajar", label: "Jurnal Mengajar", icon: <FaTasks /> }
        ].map((item) => (
          <li key={item.to} onClick={onClose}>
            <Link
              to={item.to}
              className={`flex items-center space-x-3 p-3 rounded-lg mx-3 transition-colors ${
                location.pathname === item.to ? "bg-green-400 text-white" : "hover:bg-gray-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom Section */}
      <div className="absolute bottom-4 w-full px-3">
        <button className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-400 rounded-lg hover:bg-gray-100" onClick={onClose}>
          <FaCog />
          <span>Pengaturan</span>
        </button>
        <button className="w-full mt-2 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
