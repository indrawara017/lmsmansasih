import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebase";
import { doc, getDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

const ClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔹 Cek status login pengguna
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchClassDetails = async () => {
      setLoading(true);
      try {
        // 🔹 Ambil data kelas berdasarkan ID
        const classRef = doc(db, "classes", classId);
        const classSnap = await getDoc(classRef);
        
        if (classSnap.exists()) {
          setClassData({ id: classSnap.id, ...classSnap.data() });

          // 🔹 Ambil daftar materi kelas
          const materialsRef = collection(db, "classes", classId, "materials");
          const materialsSnap = await getDocs(materialsRef);
          setMaterials(materialsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } else {
          console.error("Kelas tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error mengambil data kelas:", error);
      }
      setLoading(false);
    };

    fetchClassDetails();
  }, [classId]);

  // 🔹 Fungsi Edit Kelas
  const handleEditClass = async () => {
    const newSubject = prompt("Masukkan nama baru kelas:", classData.subject);
    if (newSubject) {
      const classRef = doc(db, "classes", classId);
      await updateDoc(classRef, { subject: newSubject });
      setClassData((prev) => ({ ...prev, subject: newSubject }));
    }
  };

  // 🔹 Fungsi Hapus Kelas
  const handleDeleteClass = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
      try {
        await deleteDoc(doc(db, "classes", classId));
        navigate("/home");
      } catch (error) {
        console.error("Gagal menghapus kelas:", error);
      }
    }
  };

  // 🔹 Fungsi Tambah Cover Kelas
  const handleUploadCover = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `class_covers/${classId}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    const classRef = doc(db, "classes", classId);
    await updateDoc(classRef, { image: imageUrl });

    setClassData((prev) => ({ ...prev, image: imageUrl }));
  };

  if (loading) {
    return <div className="text-center mt-10">Memuat data kelas...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {classData ? (
        <>
          {/* 🔹 Header Kelas */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {classData.image && <img src={classData.image} alt="Cover Kelas" className="w-full h-40 object-cover rounded-md mb-4" />}
            <h1 className="text-2xl font-bold">{classData.subject}</h1>
            <p className="text-gray-700">Kelas {classData.classLevel}</p>
            <p className="text-gray-600 mt-2">Dibuat oleh: {classData.createdBy}</p>
            <p className="mt-4">{classData.description || "Tidak ada deskripsi"}</p>

            {/* 🔹 Jika pengguna adalah pemilik kelas, tampilkan tombol edit dan hapus */}
            {user?.uid === classData.creatorId && (
              <div className="mt-4 flex gap-3">
                <button onClick={handleEditClass} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit Kelas</button>
                <button onClick={handleDeleteClass} className="bg-red-500 text-white px-4 py-2 rounded-md">Hapus Kelas</button>
                <label className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
                  Tambah Cover
                  <input type="file" className="hidden" onChange={handleUploadCover} />
                </label>
              </div>
            )}
          </div>

          {/* 🔹 Daftar Materi */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Materi Kelas</h2>
            {materials.length === 0 ? (
              <p className="text-gray-500 mt-2">Belum ada materi.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {materials.map((material) => (
                  <li key={material.id} className="bg-gray-100 p-3 rounded-md shadow-sm">
                    <h3 className="text-lg font-medium">{material.title}</h3>
                    <p className="text-gray-600">{material.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🔹 Tombol Kembali */}
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => navigate("/home")}>
            Kembali ke Beranda
          </button>
        </>
      ) : (
        <p className="text-red-500 text-center">Kelas tidak ditemukan.</p>
      )}
    </div>
  );
};

export default ClassPage;
