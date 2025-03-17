import React from "react";
import SubjectCard from "./SubjectCard";
import biologiImage from "../assets/biologi.png";
import geografiImage from "../assets/agama.png";
import matematikaImage from "../assets/biologi.png";
import kimiaImage from "../assets/agama.png";

const subjects = [
  { subject: "Biologi", grade: "XI", image: biologiImage, teacher: "Indra Wardana" },
  { subject: "Geografi", grade: "X", image: geografiImage, teacher: "Indra Wardana" },
  { subject: "Matematika", grade: "XI", image: matematikaImage, teacher: "Indra Wardana" },
  { subject: "Kimia", grade: "XI", image: kimiaImage, teacher: "Indra Wardana" },
];

const Home = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subjects.map((subject, index) => (
          <SubjectCard
            key={index}
            subject={subject.subject}
            grade={subject.grade}
            image={subject.image}
            teacher={subject.teacher}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
