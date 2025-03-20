import React, { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from "browser-image-compression";
import defaultAvatar from "../assets/avatar.jpg";

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
    photoURL: defaultAvatar,
  });
  const [loading, setLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(defaultAvatar);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser);
      } else {
        setUser(null);
        setProfile({ ...profile, photoURL: defaultAvatar });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async (currentUser) => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      let photoURL = currentUser.photoURL || defaultAvatar;

      if (userDoc.exists()) {
        const data = userDoc.data();
        photoURL = data.photoURL || defaultAvatar;
        setProfile({
          ...data,
          email: currentUser.email,
          photoURL,
        });
      } else {
        const defaultProfile = {
          name: currentUser.displayName || "",
          email: currentUser.email,
          phone: "",
          dob: "",
          gender: "",
          photoURL,
        };
        await setDoc(userRef, defaultProfile);
        setProfile(defaultProfile);
      }
      setPhotoPreview(photoURL);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setNewPhoto(compressedFile);
      setPhotoPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Gagal mengompres foto:", error);
    }
  };

  const handleSave = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let photoURL = profile.photoURL;
      if (newPhoto) {
        const photoRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(photoRef, newPhoto);
        photoURL = await getDownloadURL(photoRef);
        await updateProfile(user, { photoURL });
      }
      const updatedProfile = { ...profile, photoURL };
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updatedProfile);
      await fetchProfile(user);
      setNewPhoto(null);
    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    }
    setLoading(false);
  }, [user, profile, newPhoto]);

  const handleDeletePhoto = async () => {
    setLoading(true);
    try {
      const photoRef = ref(storage, `profile_pictures/${user.uid}`);
      const urlCheck = await getDownloadURL(photoRef).catch(() => null);
      if (urlCheck) {
        await deleteObject(photoRef);
      }
      await updateProfile(user, { photoURL: defaultAvatar });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL: defaultAvatar });
      setProfile((prevProfile) => ({ ...prevProfile, photoURL: defaultAvatar }));
      setPhotoPreview(defaultAvatar);
    } catch (error) {
      console.error("Gagal menghapus foto:", error);
    }
    setLoading(false);
  };
  
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-15">
      <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden">
          <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
        </div>

        <div className="flex space-x-5">
          <label className="px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer">
            Ganti Foto
            <input type="file" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {profile.photoURL !== defaultAvatar && (
            <button onClick={handleDeletePhoto} className="px-4 py-2 text-white bg-red-500 rounded-md">
              Hapus Foto
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
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
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-600 transition duration-200"
      >
        Simpan
      </button>
    </div>
  );
};

export default Profile;
