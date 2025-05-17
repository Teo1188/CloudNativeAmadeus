import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setThemeMode, isDark } = useTheme();
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'true');

  useEffect(() => {
    localStorage.setItem('notifications', notifications.toString());
  }, [notifications]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
  };

  const toggleNotifications = () => {
    setNotifications(prevState => !prevState);
  };

  const resetSettings = () => {
    setThemeMode('light');
    setNotifications(false);

    localStorage.setItem('notifications', 'false');
  };

  // Aplicando el modo oscuro a todo el documento
  useEffect(() => {
    // Cambiar el color de fondo del body
    document.body.className = isDark ? 'bg-gray-900' : 'bg-white';
    
    // Seleccionar el elemento main y actualizar su clase
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // Mantener las clases existentes pero reemplazar la clase de fondo
      const classes = mainElement.className.replace(/bg-\w+-\d+/g, '');
      mainElement.className = `${classes} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`.trim();
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex justify-center p-8 transition-colors duration-200 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    }`}>
       {/* contenedor ajustado */}
       <div className={`shadow-2xl rounded-3xl w-full max-w-lg p-6 mt-8 min-h-[350px] max-h-[400px] transition-colors duration-200 ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
      }`}>
        
        {/* Header ajustado */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-2 rounded-full transition-colors duration-200 ${
              isDark ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-200 text-blue-700'
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="ml-4 text-2xl font-bold">
            {('settings')}
          </h1>
        </div>

        {/* Contenido principal con espaciado ajustado */}
        <div>
          <h3 className={`text-sm font-semibold py-2 px-3 rounded-lg transition-colors duration-200 ${
            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {('preferences')}
          </h3>
          
          {/* Lista de opciones con espacio reducido */}
          <div className="mt-6 space-y-4">

            <div className={`flex justify-between items-center py-3 border-b transition-colors duration-200 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              {/* Espacio reducido */}
            </div>

            {/* Elementos con menos padding vertical */}
            <div className={`flex justify-between items-center py-3 border-b transition-colors duration-200 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <span className="text-base">
                {('darkMode')}
              </span>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  isDark ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={isDark ? ('activateLightMode') : ('activateDarkMode')}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  isDark ? 'translate-x-6' : ''
                }`}></div>
              </button>
            </div>

            <div className={`flex justify-between items-center py-3 border-b transition-colors duration-200 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <span className="text-base">
                {('notifications')}
              </span>
              <button
                onClick={toggleNotifications}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={notifications ? ('deactivateNotifications') : ('activateNotifications')}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  notifications ? 'translate-x-6' : ''
                }`}></div>
              </button>
            </div>

            <div className={`flex justify-between items-center py-3 border-b transition-colors duration-200 ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <span className="text-base">
                {('reset')}
              </span>
              <button
                onClick={resetSettings}
                className={`hover:underline transition-colors duration-200 ${
                  isDark ? 'text-red-400' : 'text-red-500'
                }`}
              >
                {('resetButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;