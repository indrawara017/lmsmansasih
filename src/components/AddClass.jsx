import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddClass = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [room, setRoom] = useState("");
  const [classCode, setClassCode] = useState(null);

  const subjects = [
    "Pendidikan Agama dan Budi Pekerti", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika",
    "Bahasa Inggris", "Pendidikan Jasmani, Olahraga, dan Kesehatan", "Seni Budaya", "Informatika",
    "Prakarya dan Kewirausahaan", "Fisika", "Kimia", "Biologi", "Geografi", "Sejarah", "Sosiologi",
    "Ekonomi", "Bahasa Indonesia Tingkat Lanjut", "Matematika Tingkat Lanjut",
    "Bahasa Inggris Tingkat Lanjut", "Sejarah Tingkat Lanjut"
  ];
  
  const classLevels = ["X", "XI", "XII"];
  const rooms = ["A", "B", "C", "D", "E", "F", "G"];

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !classLevel || !room) {
      alert("Harap lengkapi semua data.");
      return;
    }
  
    const newClassCode = generateClassCode(); // Generate kode baru
    setClassCode(newClassCode);
  
    try {
      const user = auth.currentUser; // Ambil user yang sedang login
      const classData = {
        subject,
        classLevel,
        room,
        createdBy: user ? user.displayName : "Unknown",
        creatorId: user ? user.uid : null,
        classCode: newClassCode,
        createdAt: new Date(),
      };
  
      await addDoc(collection(db, "classes"), classData);
      
      alert("Kelas berhasil dibuat!");
      navigate("/home");
    } catch (error) {
      console.error("Error menambahkan kelas:", error);
      alert("Terjadi kesalahan saat membuat kelas.");
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
          <h1 className="text-lg font-semibold">Membuat Kelas</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pilih Mata Pelajaran
            </label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
              <option value="">Mata Pelajaran</option>
              {subjects.map((subj, index) => (
                <option key={index} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pilih Kelas
            </label>
            <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
              <option value="">Kelas</option>
              {classLevels.map((level, index) => (
                <option key={index} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pilih Ruang
            </label>
            <select value={room} onChange={(e) => setRoom(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white">
              <option value="">Ruang</option>
              {rooms.map((room, index) => (
                <option key={index} value={room}>{room}</option>
              ))}
            </select>
          </div>

          <button type="submit"
            className="w-full bg-lime-400 text-black font-semibold py-2 rounded-md hover:bg-lime-500">
            Buat
          </button>
        </form>

        {/* Tampilkan Kode Kelas jika sudah dibuat */}
        {classCode && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md text-center">
            <p className="text-sm font-semibold">Kode Kelas:</p>
            <p className="text-lg font-bold text-blue-600">{classCode}</p>
            <p className="text-xs text-gray-600">Gunakan kode ini untuk gabung ke kelas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddClass;
