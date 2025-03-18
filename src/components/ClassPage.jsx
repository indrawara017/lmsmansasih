import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import subjectCovers from "../data/subjectCovers";
import { FiMoreVertical } from "react-icons/fi";

const ClassPage = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Stream");
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const classRef = doc(db, "classes", classId);
                const classSnap = await getDoc(classRef);

                if (classSnap.exists()) {
                    setClassData({ id: classSnap.id, ...classSnap.data() });
                } else {
                    console.error("Kelas tidak ditemukan.");
                }
            } catch (error) {
                console.error("Error mengambil data kelas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [classId]);

    useEffect(() => {
        const fetchTeacherData = async () => {
            if (!classData?.creatorId) return;

            try {
                const teacherRef = doc(db, "users", classData.creatorId);
                const teacherSnap = await getDoc(teacherRef);

                if (teacherSnap.exists()) {
                    setTeacherData(teacherSnap.data());
                } else {
                    console.error("Guru tidak ditemukan.");
                }
            } catch (error) {
                console.error("Error mengambil data guru:", error);
            }
        };

        fetchTeacherData();
    }, [classData]);

    if (loading) {
        return <div className="text-center mt-10 text-gray-600 text-lg">Memuat data kelas...</div>;
    }

    const coverImage = classData?.subject ? subjectCovers[classData.subject] || subjectCovers.default : subjectCovers.default;

    return (
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
            <div className="relative">
                <img src={coverImage} alt="Cover Kelas" className="w-full h-[250px] object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
                <h1 className="absolute bottom-6 left-6 text-3xl font-bold text-white">{classData.subject}</h1>
            </div>

            {/* Tabs */}
            <div className="border-b mt-6">
                <ul className="flex space-x-8">
                    {["Stream", "Classwork", "People"].map((tab) => (
                        <li key={tab} className="relative">
                            <button
                                className={`p-3 text-sm font-medium transition-all duration-300 ${
                                    activeTab === tab
                                        ? "text-blue-600 border-b-4 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content */}
            <div className="mt-5 p-6 bg-gray-50 shadow-sm rounded-lg">
                {activeTab === "Stream" && (
                    <div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-700 text-lg font-medium">Kode Kelas:</p>
                                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-semibold text-lg">
                                    {classData.classCode}
                                </span>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
                                >
                                    <FiMoreVertical size={22} />
                                </button>
                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(classData.classCode)}
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                        >
                                            📋 Salin Kode
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 text-lg mt-4">Kelas {classData.classLevel}</p>
                        <p className="text-gray-500 text-sm">👨‍🏫 Guru: {teacherData?.name || classData?.createdBy || "Tidak tersedia"}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassPage;
