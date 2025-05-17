import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import { Clock, User } from "lucide-react";
 
const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, email } = useSelector((state) => state.auth);
 
 
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menú lateral */}
      <div className={`fixed top-0 left-0 h-full bg-blue-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
       
        {/* Botón para abrir/cerrar menú */}
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
 
        {/* Opciones del menú expandido */}
 
       
        <ul className={`mt-5 px-5 space-y-3 ${isOpen ? "block" : "hidden"}`}>
          { user?.roleId === 2 && (<NavLink
            to="/dashboard"
            className="flex items-center p-2 hover:bg-blue-700 rounded cursor-pointer"
          >
            <Clock className="mr-3" size={18} />
            <span>Mis horas extra</span>
          </NavLink>)}
          { user?.roleId === 1 && (<NavLink
            to="/admin-panel"
            className="flex items-center p-2 hover:bg-blue-700 rounded cursor-pointer"
          >
            <FaUserShield className="mr-3" size={18} />
            <span>Administrador</span>
          </NavLink>)}
          <NavLink
            to="/profile"
            className="flex items-center p-2 hover:bg-blue-700 rounded cursor-pointer"
          >
            <User className="mr-3" size={18} />
            <span>Mi perfil</span>
          </NavLink>
        </ul>
        {/* Iconos del menú colapsado */}
        <ul className={`mt-5 px-4 space-y-3 ${isOpen ? "hidden" : "block"}`}>
          { user?.roleId === 2 && ( <NavLink
            to="/dashboard"
            className="flex justify-center p-2 hover:bg-blue-700 rounded cursor-pointer"
            title="Mis horas extra"
          >
            <Clock size={20} />
          </NavLink>)}
          { user?.roleId === 1 && (<NavLink
            to="/admin-panel"
            className="flex justify-center p-2 hover:bg-blue-700 rounded cursor-pointer"
            title="Administrador"
          >
            <FaUserShield size={20} />
          </NavLink>)}
          <NavLink
            to="/profile"
            className="flex justify-center p-2 hover:bg-blue-700 rounded cursor-pointer"
            title="Mi perfil"
          >
            <User size={20} />
          </NavLink>
        </ul>
      </div>
 
      {/* Contenido principal */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
 
export default Layout;