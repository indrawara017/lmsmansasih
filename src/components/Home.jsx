import React from "react";
import SubjectCard from "./SubjectCard";
import agamaImage from "../assets/agama.png";
import biologiImage from "../assets/biologi.png";
import ekonomiImage from "../assets/ekonomi.png";
import fisikaImage from "../assets/fisika.png";
import geografiImage from "../assets/geografi.png";
import indonesiaImage from "../assets/indonesia.png";
import informatikaImage from "../assets/informatika.png";
import inggrisImage from "../assets/inggris.png";



const subjects = [
  { subject: "Pendidikan Agama Islam", grade: "XI", image: agamaImage, teacher: "Indra Wardana" },
  { subject: "Biologi", grade: "X", image: biologiImage, teacher: "Indra Wardana" },
  { subject: "Ekonomi", grade: "XI", image: ekonomiImage, teacher: "Indra Wardana" },
  { subject: "Fisika", grade: "XI", image: fisikaImage, teacher: "Indra Wardana" },
  { subject: "Geografi", grade: "XI", image: geografiImage, teacher: "Indra Wardana" },
  { subject: "Bahasa Indonesia", grade: "XI", image: indonesiaImage, teacher: "Indra Wardana" },
  { subject: "Informatika", grade: "XI", image: informatikaImage, teacher: "Indra Wardana" },
  { subject: "Bahasa Inggris", grade: "XI", image: inggrisImage, teacher: "Indra Wardana" },
];

const Home = () => {
  return (
    <div className="p-6 py-15">
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
