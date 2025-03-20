import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import SubjectCard from "./SubjectCard";

const Home = () => {
  const [user, setUser] = useState(null);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            uid: currentUser.uid,
            displayName: userData.displayName || currentUser.displayName,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            uid: currentUser.uid,
            displayName: currentUser.displayName || "Pengguna",
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchClasses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const createdQuery = query(collection(db, "classes"), where("creatorId", "==", user.uid));
      const joinedQuery = query(collection(db, "classes"), where("participants", "array-contains", user.uid));

      const [createdSnapshot, joinedSnapshot] = await Promise.all([
        getDocs(createdQuery),
        getDocs(joinedQuery),
      ]);

      const createdData = createdSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const joinedData = joinedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setCreatedClasses(createdData);
      setJoinedClasses(joinedData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <div className="p-4 mt-10">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600 text-lg">Loading data...</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-3"></h2>
          {createdClasses.length === 0 ? (
            <p className="text-gray-500"></p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {createdClasses.map((kelas) => (
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

          <h2 className="text-xl font-semibold mt-6 mb-3"></h2>
          {joinedClasses.length === 0 ? (
            <p className="text-gray-500"></p>
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