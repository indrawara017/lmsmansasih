import React from "react";

const SubjectCard = ({ subject, grade, image, teacher }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Gambar */}
      <img src={image} alt={subject} className="w-full object-cover" />

      {/* Informasi Mata Pelajaran */}
      <div className="p-1 text-center">
        <h2 className="text-lg font-semibold text-gray-800">{subject}</h2>
        <p className="text-sm text-gray-600">Kelas: {grade}</p>
        <p className="text-sm text-gray-600">Guru: {teacher}</p>
      </div>
    </div>
  );
};

export default SubjectCard;
