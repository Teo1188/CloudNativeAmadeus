import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme(); 
  
  const [formData, setFormData] = useState({
    nombre: "",
    genero: "",
    email: "",
    ubicacion: "",
    cargo: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("userProfile");
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(formData));
    alert("Perfil actualizado con éxito");
    navigate("/profile");
  };

  // Obtener la primera letra del nombre para el avatar
  const getInitial = () => {
    return formData.nombre ? formData.nombre.charAt(0).toUpperCase() : "U";
  };
  
  return (
    <div className={`w-screen h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-200 ${
      isDark 
        ? "bg-gray-900"
        : "bg-gradient-to-b from-[#D7D2CB] to-gray-300"
    }`}>
      <div className={`w-full max-w-lg rounded-3xl shadow-xl p-6 transition-colors duration-200 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}>
        <div className={`relative h-16 flex items-center rounded-t-3xl px-6 transition-colors duration-200 ${
          isDark 
            ? "bg-gradient-to-r from-blue-800 to-blue-900" 
            : "bg-gradient-to-r from-blue-500 to-blue-700"
        }`}>
          <Link to="/profile" className="text-white">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-lg font-semibold text-white mx-auto">Editar perfil</h2>
        </div>

        {/* Avatar del usuario - Igual que en Navbar */}
        <div className="flex justify-center mt-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold text-white ${
            isDark ? "bg-blue-700" : "bg-blue-600"
          }`}>
            {getInitial()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={`block transition-colors duration-200 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-lg transition-colors duration-200 ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <div>
            <label className={`block transition-colors duration-200 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-lg transition-colors duration-200 ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div>
            <label className={`block transition-colors duration-200 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-lg transition-colors duration-200 ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <div>
            <label className={`block transition-colors duration-200 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>Cargo</label>
            <input
              type="text"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className={`w-full mt-1 p-2 border rounded-lg transition-colors duration-200 ${
                isDark 
                  ? "bg-gray-700 border-gray-600 text-white" 
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white font-semibold py-2 rounded-lg mt-4 transition-colors duration-200 ${
              isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;