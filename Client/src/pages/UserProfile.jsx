import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const UserProfile = () => {
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const [userData, setUserData] = useState({
    nombre: "",
    genero: "Indefinido", // Valor por defecto para género
    email: "",
    cargo: "",
  });

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      
      // Mapear los datos del localStorage a nuestro estado
      setUserData({
        nombre: user.name || "",
        genero: "Indefinido", // Siempre empezará como indefinido
        email: user.email || "",
        cargo: user.roleId === 1 ? "Administrador" : "Empleado", // Ejemplo básico de mapeo de roles
      });

      // Opcional: Si existe userProfile en localStorage, mantener el género
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        setUserData(prev => ({
          ...prev,
          genero: profileData.genero || "Indefinido"
        }));
      }
    }

    // Configuración del tema
    document.body.className = isDark ? 'bg-gray-900' : 'bg-white';
    
    const mainElement = document.querySelector('main');
    if (mainElement) {
      const classes = mainElement.className.replace(/bg-\w+-\d+/g, '');
      mainElement.className = `${classes} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`.trim();
    }
  }, [isDark]);

  // Obtener la primera letra del nombre para el avatar
  const getInitial = () => {
    return userData.nombre ? userData.nombre.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${
      isDark 
        ? "bg-gradient-to-b from-gray-900 to-gray-800" 
        : "bg-gradient-to-b from-[#ffffff] to-gray-300"
    }`}>  

      <div className="flex-1 p-6">
        <div className={`w-full max-w-2xl mx-auto rounded-3xl shadow-xl overflow-hidden transition-colors duration-200 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}>
          <div className={`relative h-36 flex items-center justify-center transition-colors duration-200 ${
            isDark 
              ? "bg-gradient-to-t from-blue-900 to-blue-400" 
              : "bg-gradient-to-t from-blue-500 to-blue-700"
          }`}>
            <ArrowLeft 
              className="absolute top-6 left-6 text-white cursor-pointer" 
              size={32} 
              onClick={() => navigate(-1)}
            />
            <Link to="/editar-perfil" className="absolute top-6 right-6 text-lg font-semibold text-white hover:underline">
              Editar perfil
            </Link>
          </div>

          {/* Avatar del usuario */}
          <div className="relative -mt-12 flex justify-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg ${
              isDark ? "bg-blue-700" : "bg-blue-600"
            }`}>
              {getInitial()}
            </div>
          </div>

          <div className="px-8 pb-8">
            <h3 className={`text-base font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 ${
              isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
            }`}>
              INFORMACIÓN BÁSICA
            </h3>

            <div className="mt-4 space-y-4">
              {[
                { label: "Nombre", value: userData.nombre || "No especificado" },
                { label: "Género", value: userData.genero },
                { label: "Correo electrónico", value: userData.email || "No especificado" },
                { label: "Cargo", value: userData.cargo || "No especificado" },
              ].map((item, index) => (
                <div key={index} className={`flex justify-between items-center py-3.5 border-b transition-colors duration-200 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}>
                  <span className={`text-base transition-colors duration-200 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-medium transition-colors duration-200 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}>{item.value}</span>
                    <ChevronRight size={22} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/configuracion")}
                className={`text-white font-semibold py-3.5 px-8 rounded-lg shadow-md transition text-base ${
                  isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400 hover:bg-blue-500"
                }`}
              >
                Configuración
              </button>
            </div>   
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;