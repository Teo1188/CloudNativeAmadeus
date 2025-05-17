import React, { useEffect } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Obtener datos del usuario desde Redux
  const { user, isAuthenticated, email } = useSelector((state) => state.auth);
  

  // Obtener iniciales (primera letra del nombre o email)
  const getInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userNavigation = [
    { name: 'Tu Perfil', href: '/profile' },
    { name: 'Cerrar Sesión', href: '#', onClick: handleLogout },
  ];

  return (
    <header className={`shadow-md flex justify-between items-center p-4 transition-colors duration-200 ${
      isDark ? "bg-gray-800" : "bg-white"
    }`}>

      {/* Logo en la parte izquierda */}
      <div className="flex items-center space-x-2">
        <h1 className={`text-4xl font-bold text-blue-900 transition-colors duration-200 ${
          isDark ? "text-gray-100" : "text-blue-900"
        }`}>
          Amadeus
        </h1>
      </div>
      
      <div className="ml-auto flex items-center space-x-4">
        <div className="text-right">
          <h3 className={`font-semibold transition-colors duration-200 ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}>
            {user?.name || email?.split('@')[0] || 'Usuario'}
          </h3>
          <p className={`text-sm transition-colors duration-200 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            {user?.roleId === 1? 'Administrador':'Empleado'}
          </p>
        </div>
      
        <Menu as="div" className="relative">
          <MenuButton className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold focus:outline-none hover:bg-blue-700 transition-colors duration-200">
            {getInitials()}
          </MenuButton>

          <MenuItems className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none transition-colors duration-200 z-50 ${
            isDark ? "bg-gray-700 ring-gray-600" : "bg-white"
          }`}>
            {userNavigation.map((item) => (
              <MenuItem key={item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                      isDark 
                        ? `text-gray-200 ${active ? 'bg-gray-600' : ''}` 
                        : `text-gray-700 ${active ? 'bg-gray-100' : ''}`
                    }`}
                  >
                    {item.name}
                  </a>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
};

export default Navbar;