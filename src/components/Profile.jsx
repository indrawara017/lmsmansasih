import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const Profile = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(""); // Untuk preview gambar

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchProfile = async (currentUser) => {
    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setProfile(userDoc.data());
      setPhotoPreview(userDoc.data().photoURL || ""); // Set foto awal
    } else {
      const defaultProfile = {
        name: currentUser.displayName || "",
        email: currentUser.email,
        phone: "",
        dob: "",
        gender: "",
        photoURL: currentUser.photoURL || "",
      };
      await setDoc(userRef, defaultProfile);
      setProfile(defaultProfile);
      setPhotoPreview(currentUser.photoURL || "");
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setPhotoPreview(URL.createObjectURL(file)); // Update preview saat pilih foto
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    let photoURL = profile.photoURL;

    if (newPhoto) {
      const photoRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(photoRef, newPhoto);
      photoURL = await getDownloadURL(photoRef);
      await updateProfile(user, { photoURL });
    }

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name: profile.name,
      phone: profile.phone,
      dob: profile.dob,
      gender: profile.gender,
      photoURL,
    });

    setProfile({ ...profile, photoURL });
    setNewPhoto(null);
    setLoading(false);
  };

  const handleDeletePhoto = async () => {
    if (!profile.photoURL) return;

    try {
      const photoRef = ref(storage, `profile_pictures/${user.uid}`);
      await deleteObject(photoRef);
      await updateProfile(user, { photoURL: "" });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: "" });

      setProfile({ ...profile, photoURL: "" });
      setPhotoPreview(""); // Hapus preview foto
    } catch (error) {
      console.error("Gagal menghapus foto:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center text-gray-800">Profil</h2>

      <div className="flex flex-col items-center mt-4">
        <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-gray-400 overflow-hidden">
          {photoPreview ? (
            <img src={photoPreview} alt="Foto Profil" className="w-full h-full object-cover" />
          ) : (
            <p className="text-gray-500 text-sm text-center mt-8">Tidak ada foto</p>
          )}
        </div>

        <div className="flex mt-2 space-x-2">
          <label className="px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer">
            Ganti Foto
            <input type="file" className="hidden" onChange={handlePhotoUpload} />
          </label>
          <button onClick={handleDeletePhoto} className="px-4 py-2 text-white bg-red-500 rounded-md">
            Hapus Foto
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="block font-medium text-gray-700">Nama</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Tanggal Lahir</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Jenis Kelamin</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            disabled
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition duration-200"
      >
        Simpan
      </button>
    </div>
  );
};

export default Profile;
