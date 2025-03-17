import React, { useState } from "react";

const JurnalMengajar = () => {
  const [jurnal, setJurnal] = useState([]);
  const [formData, setFormData] = useState({
    tanggal: "",
    kelas: "",
    mataPelajaran: "",
    materi: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.tanggal && formData.kelas && formData.mataPelajaran && formData.materi) {
      setJurnal([...jurnal, formData]);
      setFormData({ tanggal: "", kelas: "", mataPelajaran: "", materi: "" });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Jurnal Mengajar</h2>
      
      {/* Form Input */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="kelas"
            placeholder="Kelas"
            value={formData.kelas}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="mataPelajaran"
            placeholder="Mata Pelajaran"
            value={formData.mataPelajaran}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="materi"
            placeholder="Materi yang Diajarkan"
            value={formData.materi}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Simpan Jurnal
        </button>
      </form>
      
      {/* Daftar Jurnal */}
      <h3 className="text-xl font-semibold mb-3">Daftar Jurnal</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Kelas</th>
            <th className="border p-2">Mata Pelajaran</th>
            <th className="border p-2">Materi</th>
          </tr>
        </thead>
        <tbody>
          {jurnal.map((item, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{item.tanggal}</td>
              <td className="border p-2">{item.kelas}</td>
              <td className="border p-2">{item.mataPelajaran}</td>
              <td className="border p-2">{item.materi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JurnalMengajar;