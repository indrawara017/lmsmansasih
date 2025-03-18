import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

const JoinClass = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const user = auth.currentUser;
    if (!user) {
      setError("Anda harus login terlebih dahulu.");
      return;
    }
  
    try {
      // 🔹 Cari kelas berdasarkan classCode
      const classQuery = query(collection(db, "classes"), where("classCode", "==", code));
      const querySnapshot = await getDocs(classQuery);
  
      if (querySnapshot.empty) {
        setError("Kode kelas tidak ditemukan!");
        return;
      }
  
      // 🔹 Ambil ID dokumen kelas pertama yang ditemukan
      const classDoc = querySnapshot.docs[0];
      const classRef = doc(db, "classes", classDoc.id);
  
      // 🔹 Tambahkan pengguna ke daftar participants
      await updateDoc(classRef, {
        participants: arrayUnion(user.uid),
      });
  
      alert("Berhasil bergabung dengan kelas!");
      navigate("/home");
    } catch (err) {
      console.error("Error joining class:", err);
      setError("Terjadi kesalahan. Periksa kembali izin akses Firestore.");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-md">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Bergabung Kelas</h1>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Kode Kelas */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kode Kelas
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Masukkan kode kelas"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
            />
          </div>

          {/* Tombol Gabung */}
          <button
            type="submit"
            className="w-full bg-lime-500 text-white font-semibold py-2 rounded-md hover:bg-lime-600"
          >
            Gabung
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinClass;
