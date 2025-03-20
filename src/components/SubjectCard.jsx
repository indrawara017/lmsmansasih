import React from "react";
import { useNavigate } from "react-router-dom";
import subjectCovers, { defaultCover } from "../data/subjectCovers";

const SubjectCard = ({ classId, subject, grade, teacher, room }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/class/${classId}`)}
      className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="w-full h-76 bg-gray-100">
        <img
          src={subjectCovers[subject] || defaultCover}
          alt={subject}
          className="w-full h-full object-cover rounded-t-xl"
          onError={(e) => (e.target.src = defaultCover)}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{subject}</h3>
        <p className="text-sm text-gray-600 mt-1">
          Kelas: {grade} {room}
        </p>
        <p className="text-sm text-gray-500 mt-2">Guru: {teacher}</p>
      </div>
    </div>
  );
};

export default SubjectCard;
