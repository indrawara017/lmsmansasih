import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Sembunyikan Header jika berada di halaman login
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        {!isLoginPage && <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
