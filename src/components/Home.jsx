import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import SubjectCard from "./SubjectCard";

const Home = () => {
  const [user, setUser] = useState(null);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchClasses = async () => {
      setLoading(true);
      try {
        const createdQuery = query(collection(db, "classes"), where("creatorId", "==", user.uid));
        const joinedQuery = query(collection(db, "classes"), where("participants", "array-contains", user.uid));

        const [createdSnapshot, joinedSnapshot] = await Promise.all([
          getDocs(createdQuery),
          getDocs(joinedQuery),
        ]);

        setCreatedClasses(createdSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setJoinedClasses(joinedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error mengambil data kelas:", error);
      }
      setLoading(false);
    };

    fetchClasses();
  }, [user]);

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      ) : (
        <>
          {/* 🔹 Kelas yang Dibuat */}
          <h2 className="text-xl font-semibold mb-3">Kelas yang Dibuat</h2>
          {createdClasses.length === 0 ? (
            <p className="text-gray-500">Anda belum membuat kelas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {createdClasses.map((kelas) => (
                <SubjectCard
                  key={kelas.id}
                  classId={kelas.id}
                  subject={kelas.subject}
                  room={kelas.room}
                  grade={kelas.classLevel}
                  teacher={kelas.createdBy}
                />
              ))}
            </div>
          )}

          {/* 🔹 Kelas yang Diikuti */}
          <h2 className="text-xl font-semibold mt-6 mb-3">Kelas yang Diikuti</h2>
          {joinedClasses.length === 0 ? (
            <p className="text-gray-500">Anda belum bergabung ke kelas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {joinedClasses.map((kelas) => (
                <SubjectCard
                  key={kelas.id}
                  classId={kelas.id}
                  subject={kelas.subject}
                  grade={kelas.classLevel}
                  room={kelas.room}
                  teacher={kelas.createdBy}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;