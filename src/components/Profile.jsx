import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "", // Tambahkan tanggal lahir
    photoURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null);

  // Ambil data profil dari Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user, db]);
  
  const updateUserProfile = async (userId, data) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      await setDoc(docRef, data, { merge: true }); // Merges data if document exists
    } else {
      console.error("User document does not exist!");
    }
  };

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Fungsi untuk upload foto profil
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
    }
  };

  // Simpan perubahan ke Firestore
  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    let photoURL = profile.photoURL;

    if (newPhoto) {
      const photoRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(photoRef, newPhoto);
      photoURL = await getDownloadURL(photoRef);
    }

    await updateDoc(doc(db, "users", user.uid), {
      ...profile,
      photoURL,
    });

    setProfile({ ...profile, photoURL });
    setNewPhoto(null);
    setLoading(false);
    alert("Profil berhasil diperbarui!");
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center">Profil Saya</h2>

      <div className="flex flex-col items-center mt-4">
        <img
          src={profile.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <input type="file" className="mt-2" onChange={handlePhotoUpload} />
      </div>

      <div className="mt-4">
        <label className="block font-medium">Nama</label>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div className="mt-4">
        <label className="block font-medium">No. HP</label>
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block font-medium">Tanggal Lahir</label>
        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Simpan Perubahan
      </button>
    </div>
  );
};

export default Profile;
