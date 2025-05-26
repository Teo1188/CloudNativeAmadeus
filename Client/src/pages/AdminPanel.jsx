import React, { useState, useEffect } from 'react';
import { Clock, Users, UserPlus, UserCheck, UserX, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaTimes } from "react-icons/fa";
import api from '../api/axiosInstance';

const AdminPanel = ({ onClose }) => {
  const { theme, isDark } = useTheme();
  const [registros, setRegistros] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRegistros, setFilteredRegistros] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    email: "",
    rol: "empleado",
    password: ""
  });

  const [stats, setStats] = useState({
    totalHoras: 0,
    horasAprobadas: 0,
    horasPendientes: 0,
    totalEmpleados: 0
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const horasResponse = await api.get('/api/extra-hours?status=Pendiente');
        setRegistros(horasResponse.data);
        
        const empleadosResponse = await api.get('/api/users');
        setEmpleados(empleadosResponse.data);
        
        calculateStats(horasResponse.data, empleadosResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error al cargar datos iniciales");
      }
    };
    
    loadInitialData();
  }, []);

  const calculateStats = (horasData, empleadosData) => {
    const horasActuales = horasData.filter(reg => reg !== null && reg !== undefined);
    const totalHoras = horasActuales.reduce((sum, reg) => {
      return sum + calculateRoundedHours(reg.startTime, reg.endTime);
    }, 0);
    const horasAprobadas = horasActuales.filter(r => r.status === "Aprobado").length;
    const horasPendientes = horasActuales.filter(r => r.status === "Pendiente").length;

    setStats({
      totalHoras,
      horasAprobadas,
      horasPendientes,
      totalEmpleados: empleadosData.length
    });
  };

  const calculateRoundedHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = (end - start) / (1000 * 60 * 60);
    return Math.round(diff > 0 ? diff : 0);
  };

  useEffect(() => {
    const filtered = registros.filter(registro =>
      registro.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.date?.includes(searchTerm) ||
      registro.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.extraHourType?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRegistros(filtered);
  }, [searchTerm, registros]);

  const manejarAprobacion = async (id, accion) => {
    try {
      let response;
      
      if (accion === 'aprobar') {
        response = await api.put(`/api/extra-hours/${id}/approve`, {
          approvedById: 1 // ID del admin que aprueba
        });
      } else {
        response = await api.put(`/api/extra-hours/${id}/reject`, {
          approvedById: 1 // ID del admin que rechaza
        });
      }

      const nuevosRegistros = registros.map(registro => {
        if (registro.id === id) {
          return { 
            ...registro, 
            status: accion === 'aprobar' ? 'Aprobado' : 'Denegado',
            approvedById: 1
          };
        }
        return registro;
      });

      setRegistros(nuevosRegistros);
      calculateStats(nuevosRegistros, empleados);
      
      alert(`Horas extra ${accion === 'aprobar' ? 'aprobadas' : 'denegadas'} correctamente`);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
      alert(`Error al ${accion === 'aprobar' ? 'aprobar' : 'denegar'} las horas extras`);
    }
  };

  const crearEmpleado = async () => {
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.email || !nuevoEmpleado.password) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await api.post('/api/users', {
        name: nuevoEmpleado.nombre,
        email: nuevoEmpleado.email,
        password: nuevoEmpleado.password,
        roleId: nuevoEmpleado.rol === "supervisor" ? 2 : 1
      });

      setEmpleados([...empleados, response.data]);
      setNuevoEmpleado({ nombre: "", email: "", rol: "empleado", password: "" });
      setStats({ ...stats, totalEmpleados: empleados.length + 1 });
    } catch (error) {
      console.error("Error al crear empleado:", error);
      alert("Error al crear el empleado");
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este empleado?")) {
      return;
    }

    try {
      await api.delete(`/api/users/${id}`);
      setEmpleados(empleados.filter(emp => emp.id !== id));
      setStats({ ...stats, totalEmpleados: empleados.length - 1 });
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      alert("Error al eliminar el empleado");
    }
  };

  const mainBgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const panelBgColor = isDark ? "bg-gray-800/80" : "bg-white";

  return (
    <div className="relative">
      <div className={`min-h-screen w-full ${mainBgColor} text-${isDark ? "white" : "gray-800"} transition-colors duration-200`}>
        <div className="container mx-auto p-6 space-y-6">
          <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
            <h3 className="text-xl font-bold mb-4">Resumen Administrativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-blue-900/30" : "bg-blue-50"
              }`}>
                <Clock className="mx-auto mb-3 text-blue-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Total horas registradas</h4>
                <p className="text-2xl font-bold text-blue-600">{stats.totalHoras}</p>
              </div>
              
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-green-900/30" : "bg-green-50"
              }`}>
                <UserCheck className="mx-auto mb-3 text-green-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Horas aprobadas</h4>
                <p className="text-2xl font-bold text-green-600">{stats.horasAprobadas}</p>
              </div>
              
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-yellow-900/30" : "bg-yellow-50"
              }`}>
                <Clock className="mx-auto mb-3 text-yellow-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Horas pendientes</h4>
                <p className="text-2xl font-bold text-yellow-600">{stats.horasPendientes}</p>
              </div>
              
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
                        <td className="p-3">{registro.user?.name}</td>
                        <td className="p-3">{new Date(registro.date).toLocaleDateString()}</td>
                        <td className="p-3">{registro.reason}</td>
                        <td className="p-3">{calculateRoundedHours(registro.startTime, registro.endTime)}</td>
                        <td className="p-3">{registro.extraHourType?.name}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            registro.status === "Pendiente" 
                              ? isDark ? "bg-yellow-800/50 text-yellow-200" : "bg-yellow-100 text-yellow-800" 
                              : registro.status === "Aprobado"
                                ? isDark ? "bg-green-800/50 text-green-200" : "bg-green-100 text-green-800"
                                : isDark ? "bg-red-800/50 text-red-200" : "bg-red-100 text-red-800"
                          }`}>
                            {registro.status}
                          </span>
                        </td>
                        <td className="p-3 flex gap-2">
                          {registro.status === "Pendiente" && (
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

          <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-purple-500" /> Gestión de Empleados
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
              <input
                type="password"
                placeholder="Contraseña"
                className={`p-2 border rounded transition-colors duration-200 ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                value={nuevoEmpleado.password}
                onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, password: e.target.value})}
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
                      <td className="p-3">{empleado.name}</td>
                      <td className="p-3">{empleado.email}</td>
                      <td className="p-3 capitalize">{empleado.role?.name || empleado.rol}</td>
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