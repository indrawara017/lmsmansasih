import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const hideHeader = location.pathname === "/" || location.pathname === "/register";

  return (
    <div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div>
        {!hideHeader && <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
