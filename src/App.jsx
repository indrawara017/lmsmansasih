import React from "react";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import AddClass from "./components/AddClass";
import JoinClass from "./components/JoinClass";
import ClassPage from "./components/ClassPage";
import JurnalMengajar from "./components/JurnalMengajar";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tambah-kelas" element={<AddClass />} />
          <Route path="/gabung-kelas" element={<JoinClass />} />
          <Route path="/class/:classId" element={<ClassPage />} />
          <Route path="/jurnal-mengajar" element={<JurnalMengajar />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
