import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword } from "../firebase";
import Modal from "./Modal";
import leftPanelImage from "../assets/left-panel-image.jpg";
import logo from "../assets/blensasih large.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Semua kolom harus diisi.");
      setShowModal(true);
      return;
    }

    if (!validateEmail(email)) {
      setError("Format email tidak valid.");
      setShowModal(true);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            setError("Email belum terdaftar.");
            break;
          case "auth/wrong-password":
            setError("Password salah.");
            break;
          case "auth/invalid-email":
            setError("Email tidak valid.");
            break;
          default:
            setError("Login gagal. Silakan coba lagi.");
        }
        setShowModal(true);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/home");
      })
      .catch(() => {
        setError("Login Google gagal. Silakan coba lagi.");
        setShowModal(true);
      });
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <img src={leftPanelImage} alt="Left Panel" className="w-full" />
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-10">
          <img src={logo} alt="Logo" className="h-52 w-71 mx-auto" />
          <h1 className="text-1xl font-bold mb-1 text-black text-center">BLENSASIH</h1>
          <h1 className="text-1xl font-semibold mb-0 text-black text-center">BLENDED LEARNING</h1>
          <h1 className="text-1xl font-semibold mb-4 text-black text-center">SMA NEGERI 1 SUMBERASIH</h1>
          <div onClick={handleGoogleLogin} className="w-full mb-2 lg:mb-0">
            <button type="button" className="w-full flex justify-center items-center gap-2 bg-white text-sm text-gray-600 p-2 rounded-md hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300">
              <svg viewBox="0 0 512 512" className="w-4" id="google">
                <path fill="#fbbb00" d="M113.47 309.408 95.648 375.94l-65.139 1.378C11.042 341.211 0 299.9 0 256c0-42.451 10.324-82.483 28.624-117.732h.014L86.63 148.9l25.404 57.644c-5.317 15.501-8.215 32.141-8.215 49.456.002 18.792 3.406 36.797 9.651 53.408z"></path>
                <path fill="#518ef8" d="M507.527 208.176C510.467 223.662 512 239.655 512 256c0 18.328-1.927 36.206-5.598 53.451-12.462 58.683-45.025 109.925-90.134 146.187l-.014-.014-73.044-3.727-10.338-64.535c29.932-17.554 53.324-45.025 65.646-77.911h-136.89V208.176h245.899z"></path>
                <path fill="#28b446" d="m416.253 455.624.014.014C372.396 490.901 316.666 512 256 512c-97.491 0-182.252-54.491-225.491-134.681l82.961-67.91c21.619 57.698 77.278 98.771 142.53 98.771 28.047 0 54.323-7.582 76.87-20.818l83.383 68.262z"></path>
                <path fill="#f14336" d="m419.404 58.936-82.933 67.896C313.136 112.246 285.552 103.82 256 103.82c-66.729 0-123.429 42.957-143.965 102.724l-83.397-68.276h-.014C71.23 56.123 157.06 0 256 0c62.115 0 119.068 22.126 163.404 58.936z"></path>
              </svg> Sign In with Google
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            <p>or with email</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Belum punya akun? <Link to="/register" className="text-black hover:underline">Daftar di sini</Link></p>
          </div>
          <Modal show={showModal} handleClose={() => setShowModal(false)}>
            <p>{error}</p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Login;