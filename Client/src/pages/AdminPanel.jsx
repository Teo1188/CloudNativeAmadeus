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

const manejarAprobacion = async (extraHourId, accion) => {
  try {
    if (!extraHourId) throw new Error("ID de horas extra no proporcionado");

    const registroActual = registros.find(r => r.id === extraHourId);
    if (!registroActual) throw new Error("Registro no encontrado");

    const nuevoEstado = accion === 'aprobar' ? 'Aprobado' : 'Rechazado';

    const requestData = {
      ...registroActual,
      approvedById: 1,
      status: nuevoEstado,
      user: registroActual.user,
      extraHourType: registroActual.extraHourType
    };

    const response = await api.put(`/api/extra-hours/${extraHourId}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.data) throw new Error("Error: respuesta vacía del servidor");

    // Actualizar estado local
    const nuevosRegistros = registros.map(reg =>
      reg.id === extraHourId ? { ...reg, status: nuevoEstado } : reg
    );
    setRegistros(nuevosRegistros);
    calculateStats(nuevosRegistros, empleados);

    alert(`Horas extras ${accion === 'aprobar' ? 'aprobadas' : 'rechazadas'} correctamente`);
  } catch (error) {
    console.error('Error detallado:', error);

    let errorMessage = `Error al ${accion === 'aprobar' ? 'aprobar' : 'rechazar'} las horas extras`;

    if (error.response?.data?.includes('FK_ExtraHours_ExtraHourTypes_ExtraHourTypeId')) {
      errorMessage = "Error: Problema con el tipo de hora extra. Contacte al administrador.";
    } else if (error.response?.status === 500) {
      errorMessage = "Error interno del servidor. Intente nuevamente o contacte al administrador.";
    } else if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    alert(errorMessage);
  }
};

  const crearEmpleado = async () => {
  // Validación básica
  if (!nuevoEmpleado.nombre || !nuevoEmpleado.email || !nuevoEmpleado.password) {
    alert("Por favor complete todos los campos");
    return;
  }

  if (nuevoEmpleado.password.length < 8) {
    alert("La contraseña debe tener al menos 8 caracteres");
    return;
  }

  try {
    // Datos del usuario - FORZAMOS RoleId = 2 (empleado)
    const userData = {
      name: nuevoEmpleado.nombre,
      email: nuevoEmpleado.email,
      password: nuevoEmpleado.password,
      roleId: 2, // Siempre empleado, sin importar lo que seleccione el admin
      departmentId: 1, // Ajusta según tu lógica
      salary: 0 // Valor por defecto
    };

    const registerResponse = await api.post('/api/users/register', userData);
    
    if (!registerResponse.data || !registerResponse.data.id) {
      throw new Error("No se recibieron datos válidos del servidor");
    }

    // Actualizamos la lista de empleados
    const newEmployee = {
      ...registerResponse.data,
      roleId: 2, // Aseguramos que se muestre como empleado
      role: { name: 'Empleado' } // Para la visualización
    };

    setEmpleados([...empleados, newEmployee]);
    setNuevoEmpleado({ nombre: "", email: "", password: "" });
    setStats({ ...stats, totalEmpleados: empleados.length + 1 });

    alert("Empleado creado exitosamente con rol de Empleado");
    
  } catch (error) {
    console.error("Error al crear empleado:", error);
    
    let errorMessage = "Error al crear el empleado";
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = "Datos inválidos: " + (error.response.data.message || "verifique la información");
      } else if (error.response.status === 409) {
        errorMessage = "El correo electrónico ya está registrado";
      } else {
        errorMessage = `Error del servidor (${error.response.status})`;
      }
    }
    
    alert(errorMessage);
  }
};

const eliminarEmpleado = async (id) => {
  try {
    // Buscar el usuario a eliminar
    const usuarioAEliminar = empleados.find(emp => emp.id === id);
    
    // Verificar si es el admin principal
    if (usuarioAEliminar && usuarioAEliminar.email === "admin@admin.com") {
      alert("No se puede eliminar al usuario administrador principal");
      return;
    }

    // Confirmación del usuario
    if (!window.confirm(`¿Está seguro que desea eliminar al usuario ${usuarioAEliminar?.name || ''}?`)) {
      return;
    }

    // Llamar al endpoint de eliminación
    await api.delete(`/api/users/${id}`);

    // Actualizar el estado local
    setEmpleados(empleados.filter(emp => emp.id !== id));
    setStats({ ...stats, totalEmpleados: empleados.length - 1 });
    
    alert("Usuario eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    
    let errorMessage = "Error al eliminar el empleado";
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = "El usuario no fue encontrado";
      } else if (error.response.status === 403) {
        errorMessage = "No tiene permisos para realizar esta acción";
      } else {
        errorMessage = `Error del servidor (${error.response.status})`;
      }
    }
    
    alert(errorMessage);
  }
};

  const mainBgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const panelBgColor = isDark ? "bg-gray-800/80" : "bg-white";

  return (
    <div className="relative">
      <div className={`min-h-screen w-full ${mainBgColor} text-${isDark ? "white" : "gray-800"} transition-colors duration-200`}>
        <div className="container mx-auto p-6 space-y-6">
          {/* Resumen Administrativo */}
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
                }`}>Solicitudes aprobadas</h4>
                <p className="text-2xl font-bold text-green-600">{stats.horasAprobadas}</p>
              </div>
              
              <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
                isDark ? "bg-yellow-900/30" : "bg-yellow-50"
              }`}>
                <Clock className="mx-auto mb-3 text-yellow-500" size={40} />
                <h4 className={`text-base transition-colors duration-200 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>Solicitudes pendientes</h4>
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

          {/* Buscador */}
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

          {/* Horas Extras Pendientes */}
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

          {/* Gestión de Empleados */}
          <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-purple-500" /> Gestión de Empleados
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> {/* Cambiado de 5 a 4 columnas */}
              <input
                type="text"
                placeholder="Nombre completo"
                className={`p-2 border rounded transition-colors duration-200 ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                value={nuevoEmpleado.nombre}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className={`p-2 border rounded transition-colors duration-200 ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                value={nuevoEmpleado.email}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Contraseña (mín. 8 caracteres)"
                className={`p-2 border rounded transition-colors duration-200 ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                value={nuevoEmpleado.password}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, password: e.target.value })}
                minLength="8"
                required
              />
              <button
                className={`text-white p-2 rounded transition-colors duration-200 ${isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                onClick={crearEmpleado}
                disabled={!nuevoEmpleado.nombre || !nuevoEmpleado.email || !nuevoEmpleado.password}
              >
                Agregar Empleado
              </button>
            </div>

            {/* Mensaje explicativo */}
            <div className={`mb-4 p-3 rounded ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}>
              <p className="text-sm">
                <strong>Nota:</strong> Todos los usuarios creados tendrán rol de <strong>Empleado</strong>
                y no podrán acceder a funciones administrativas.
              </p>
            </div>

            {/* Mensaje de validación de contraseña */}
            {nuevoEmpleado.password && nuevoEmpleado.password.length < 8 && (
              <p className={`text-sm mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}>
                La contraseña debe tener al menos 8 caracteres
              </p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`text-left transition-colors duration-200 ${isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado) => (
                    <tr key={empleado.id} className={`border-t transition-colors duration-200 ${isDark ? "border-gray-700" : "border-gray-200"
                      }`}>
                      <td className="p-3">{empleado.name}</td>
                      <td className="p-3">{empleado.email}</td>
                      <td className="p-3 capitalize">
                        {empleado.roleId === 1 ? 'Administrador' : 'Empleado'}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => eliminarEmpleado(empleado.id)}
                          className={`px-3 py-1 rounded text-sm ${isDark ? "bg-red-700 hover:bg-red-800" : "bg-red-600 hover:bg-red-700"
                            } text-white flex items-center gap-1`}
                          disabled={empleado.email === "admin@admin.com"}
                        >
                          <UserX size={16} /> Eliminar
                          {empleado.email === "admin@admin.com" && (
                            <span className="sr-only">(No se puede eliminar al administrador principal)</span>
                          )}
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