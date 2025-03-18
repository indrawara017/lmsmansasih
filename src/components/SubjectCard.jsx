import React from "react";
import { useNavigate } from "react-router-dom";
import subjectCovers, { defaultCover } from "../data/subjectCovers";

const SubjectCard = ({ classId, subject, grade, teacher, room }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/class/${classId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* 🔹 Gambar Mata Pelajaran */}
      <div className="w-full aspect-w-16 aspect-h-9 bg-gray-100">
        <img
          src={subjectCovers[subject] || defaultCover}
          alt={subject}
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      {/* 🔹 Konten */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{subject}</h3>
        <p className="text-sm text-gray-600 mt-1">Kelas : {grade} {room}</p>
        <p className="text-sm text-gray-500 mt-1">Guru : {teacher}</p>
      </div>
    </div>
  );
};

export default SubjectCard;
