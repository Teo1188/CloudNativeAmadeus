import React, { useState, useEffect } from 'react';
import { Clock, Users, UserPlus, UserCheck, UserX, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaTimes } from "react-icons/fa";

const AdminPanel = ({ onClose }) => {
  const { theme, isDark } = useTheme();

  // Datos de ejemplo - reemplazar con datos reales
  const [registros, setRegistros] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      fecha: "2023-05-15",
      actividad: "Proyecto X",
      horas: "3",
      tipoHoraExtra: "Diurna",
      estado: "Pendiente"
    },
    {
      id: 2,
      nombre: "María García",
      fecha: "2023-05-16",
      actividad: "Informe mensual",
      horas: "2",
      tipoHoraExtra: "Nocturna",
      estado: "Pendiente"
    },
    {
      id: 3,
      nombre: "Mark",
      fecha: "2023-05-16",
      actividad: "Informe mensual",
      horas: "2",
      tipoHoraExtra: "Nocturna",
      estado: "Pendiente"
    }
  ]);

  const [empleados, setEmpleados] = useState([
    { id: 1, nombre: "Juan Pérez", email: "juan@empresa.com", rol: "empleado" },
    { id: 2, nombre: "María García", email: "maria@empresa.com", rol: "supervisor" },
    { id: 2, nombre: "Mark", email: "mark@empleado.com", rol: "empleado" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    email: "",
    rol: "empleado"
  });

  // Estadísticas
  const [stats, setStats] = useState({
    totalHoras: registros.reduce((sum, reg) => sum + parseInt(reg.horas), 0),
    horasAprobadas: registros.filter(r => r.estado === "Aprobado").length,
    horasPendientes: registros.filter(r => r.estado === "Pendiente").length,
    totalEmpleados: empleados.length
  });

  // Filtrado de registros
  useEffect(() => {
    const filtered = registros.filter(registro =>
      registro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.fecha.includes(searchTerm) ||
      registro.actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.tipoHoraExtra.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegistros(filtered);
  }, [searchTerm, registros]);

  // Manejar aprobación/denegación
  const manejarAprobacion = (id, accion) => {
    const nuevosRegistros = registros.map(registro => {
      if (registro.id === id) {
        return { ...registro, estado: accion === 'aprobar' ? 'Aprobado' : 'Denegado' };
      }
      return registro;
    });

    setRegistros(nuevosRegistros);
    setStats({
      ...stats,
      horasAprobadas: nuevosRegistros.filter(r => r.estado === "Aprobado").length,
      horasPendientes: nuevosRegistros.filter(r => r.estado === "Pendiente").length
    });
  };

  // Crear nuevo empleado
  const crearEmpleado = () => {
    if (nuevoEmpleado.nombre && nuevoEmpleado.email) {
      const nuevo = { ...nuevoEmpleado, id: Date.now() };
      setEmpleados([...empleados, nuevo]);
      setNuevoEmpleado({ nombre: "", email: "", rol: "empleado" });
      setStats({ ...stats, totalEmpleados: empleados.length + 1 });
    }
  };

  // Eliminar empleado
  const eliminarEmpleado = (id) => {
    setEmpleados(empleados.filter(emp => emp.id !== id));
    setStats({ ...stats, totalEmpleados: empleados.length - 1 });
  };

  const mainBgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const panelBgColor = isDark ? "bg-gray-800/80" : "bg-white";

  return (
    <div className="relative">

      <div className={`min-h-screen w-full ${mainBgColor} text-${isDark ? "white" : "gray-800"} transition-colors duration-200`}>
        <div className="container mx-auto p-6 space-y-6">
          {/* Resumen Estadístico */}
          <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
            <h3 className="text-xl font-bold mb-4">Resumen Administrativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {/* Tarjeta Horas Totales */}
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-blue-900/30" : "bg-blue-50"
              }`}>
                <Clock className="mx-auto mb-3 text-blue-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Total horas registradas</h4>
                <p className="text-2xl font-bold text-blue-600">{stats.totalHoras}</p>
              </div>
              
              {/* Tarjeta Horas Aprobadas */}
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-green-900/30" : "bg-green-50"
              }`}>
                <UserCheck className="mx-auto mb-3 text-green-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Horas aprobadas</h4>
                <p className="text-2xl font-bold text-green-600">{stats.horasAprobadas}</p>
              </div>
              
              {/* Tarjeta Horas Pendientes */}
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-yellow-900/30" : "bg-yellow-50"
              }`}>
                <Clock className="mx-auto mb-3 text-yellow-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Horas pendientes</h4>
                <p className="text-2xl font-bold text-yellow-600">{stats.horasPendientes}</p>
              </div>
              
              {/* Tarjeta Empleados */}
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-purple-900/30" : "bg-purple-50"
              }`}>
                <Users className="mx-auto mb-3 text-purple-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Total empleados</h4>
                <p className="text-2xl font-bold text-purple-600">{stats.totalEmpleados}</p>
              </div>
            </div>
          </div>

          {/* Buscador de horas extras */}
          <div className="mb-6 flex items-center">
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar horas extras..."
                className={`pl-10 p-2 border rounded-full w-full transition-colors duration-200 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de Horas Extras */}
          <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-blue-500" /> Horas Extras Pendientes
            </h2>
            
            {filteredRegistros.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`text-left transition-colors duration-200 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                      <th className="p-3">Empleado</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Actividad</th>
                      <th className="p-3">Horas</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistros.map((registro) => (
                      <tr key={registro.id} className={`border-t transition-colors duration-200 ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}>
                        <td className="p-3">{registro.nombre}</td>
                        <td className="p-3">{registro.fecha}</td>
                        <td className="p-3">{registro.actividad}</td>
                        <td className="p-3">{registro.horas}</td>
                        <td className="p-3">{registro.tipoHoraExtra}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            registro.estado === "Pendiente" 
                              ? isDark ? "bg-yellow-800/50 text-yellow-200" : "bg-yellow-100 text-yellow-800" 
                              : registro.estado === "Aprobado"
                                ? isDark ? "bg-green-800/50 text-green-200" : "bg-green-100 text-green-800"
                                : isDark ? "bg-red-800/50 text-red-200" : "bg-red-100 text-red-800"
                          }`}>
                            {registro.estado}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          {registro.estado === "Pendiente" && (
                            <>
                              <button 
                                onClick={() => manejarAprobacion(registro.id, 'aprobar')}
                                className={`px-3 py-1 rounded text-sm ${
                                  isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                              >
                                Aprobar
                              </button>
                              <button 
                                onClick={() => manejarAprobacion(registro.id, 'denegar')}
                                className={`px-3 py-1 rounded text-sm ${
                                  isDark ? "bg-red-700 hover:bg-red-800" : "bg-red-600 hover:bg-red-700"
                                } text-white`}
                              >
                                Denegar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className={`transition-colors duration-200 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                {searchTerm ? "No se encontraron resultados" : "No hay horas extras pendientes"}
              </p>
            )}
          </div>

          {/* Gestión de Empleados */}
          <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-purple-500" /> Gestión de Empleados
            </h2>
            
            {/* Formulario para nuevo empleado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                placeholder="Nombre completo"
                className={`p-2 border rounded transition-colors duration-200 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                value={nuevoEmpleado.nombre}
                onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`p-2 border rounded transition-colors duration-200 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                value={nuevoEmpleado.email}
                onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, email: e.target.value})}
              />
              <select
                className={`p-2 border rounded transition-colors duration-200 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                value={nuevoEmpleado.rol}
                onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, rol: e.target.value})}
              >
                <option value="empleado">Empleado</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrador</option>
              </select>
              <button
                className={`text-white p-2 rounded transition-colors duration-200 ${
                  isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={crearEmpleado}
              >
                Agregar Empleado
              </button>
            </div>
            
            {/* Lista de empleados */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`text-left transition-colors duration-200 ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado) => (
                    <tr key={empleado.id} className={`border-t transition-colors duration-200 ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}>
                      <td className="p-3">{empleado.nombre}</td>
                      <td className="p-3">{empleado.email}</td>
                      <td className="p-3 capitalize">{empleado.rol}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => eliminarEmpleado(empleado.id)}
                          className={`px-3 py-1 rounded text-sm ${
                            isDark ? "bg-red-700 hover:bg-red-800" : "bg-red-600 hover:bg-red-700"
                          } text-white flex items-center gap-1`}
                        >
                          <UserX size={16} /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;