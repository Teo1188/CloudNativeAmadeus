import React, { useState, useEffect } from 'react';
import { Clock, Users, UserPlus, UserCheck, UserX, User, Check, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FaSearch, FaTimes, FaFileExcel } from "react-icons/fa";
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

  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    onCancel: null
  });

  const [stats, setStats] = useState({
    totalHoras: 0,
    horasAprobadas: 0,
    horasPendientes: 0,
    totalEmpleados: 0
  });

  // Función para exportar a Excel
  const exportToExcel = async () => {
    try {
      // Obtener los datos nuevamente para asegurarnos de tener los más actualizados
      const response = await api.get('/api/extra-hours?status=Pendiente');
      const dataToExport = response.data;
      
      // Crear el contenido del CSV
      let csvContent = "Nombre Empleado,Fecha,Actividad,Horas,Tipo,Estado\n";
      
      dataToExport.forEach(registro => {
        const row = [
          registro.user?.name || '',
          new Date(registro.date).toLocaleDateString(),
          registro.reason || '',
          calculateRoundedHours(registro.startTime, registro.endTime),
          registro.extraHourType?.name || '',
          registro.status || ''
        ].join(',');
        
        csvContent += row + '\n';
      });
      
      // Crear el archivo y descargarlo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'horas_extras_pendientes.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      showModal('Error', 'No se pudo exportar los datos a Excel', 'error');
    }
  };

  // Función para mostrar modal
  const showModal = (title, message, type = 'info', onConfirm = null, onCancel = null) => {
    setModalConfig({
      title,
      message,
      type,
      onConfirm,
      onCancel
    });
    setModalOpen(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setModalOpen(false);
  };

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
        showModal('Error', 'Error al cargar datos iniciales', 'error');
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

  const manejarAprobacion = async (extraHourId, accion, e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
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

      const nuevosRegistros = registros.map(reg =>
        reg.id === extraHourId ? { ...reg, status: nuevoEstado } : reg
      );
      setRegistros(nuevosRegistros);
      calculateStats(nuevosRegistros, empleados);

      showModal(
        'Éxito', 
        `Horas extras ${accion === 'aprobar' ? 'aprobadas' : 'rechazadas'} correctamente`, 
        'success'
      );
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

      showModal('Error', errorMessage, 'error');
    }
  };

  const crearEmpleado = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    if (!nuevoEmpleado.nombre || !nuevoEmpleado.email || !nuevoEmpleado.password) {
      showModal('Error', 'Por favor complete todos los campos', 'error');
      return;
    }

    if (nuevoEmpleado.password.length < 8) {
      showModal('Error', 'La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    try {
      const userData = {
        name: nuevoEmpleado.nombre,
        email: nuevoEmpleado.email,
        password: nuevoEmpleado.password,
        roleId: 2, 
        departmentId: 1, 
        salary: 0 
      };

      const registerResponse = await api.post('/api/users/register', userData);
      
      if (!registerResponse.data || !registerResponse.data.id) {
        throw new Error("No se recibieron datos válidos del servidor");
      }

      const newEmployee = {
        ...registerResponse.data,
        roleId: 2, 
        role: { name: 'Empleado' } 
      };

      setEmpleados([...empleados, newEmployee]);
      setNuevoEmpleado({ nombre: "", email: "", password: "" });
      setStats({ ...stats, totalEmpleados: empleados.length + 1 });

      showModal('Éxito', 'Empleado creado exitosamente con rol de Empleado', 'success');
      
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
      
      showModal('Error', errorMessage, 'error');
    }
  };

  const eliminarEmpleado = async (id, e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto
    try {
      const usuarioAEliminar = empleados.find(emp => emp.id === id);
      
      if (usuarioAEliminar && usuarioAEliminar.email === "admin@admin.com") {
        showModal('Error', 'No se puede eliminar al usuario administrador principal', 'error');
        return;
      }

      showModal(
        'Confirmar eliminación', 
        `¿Está seguro que desea eliminar al usuario ${usuarioAEliminar?.name || ''}?`,
        'confirm',
        async () => {
          try {
            await api.delete(`/api/users/${id}`);
            setEmpleados(empleados.filter(emp => emp.id !== id));
            setStats({ ...stats, totalEmpleados: empleados.length - 1 });
            showModal('Éxito', 'Usuario eliminado correctamente', 'success');
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
            showModal('Error', errorMessage, 'error');
          }
        }
      );
    } catch (error) {
      console.error("Error en el proceso de eliminación:", error);
      showModal('Error', 'Ocurrió un error inesperado', 'error');
    }
  };

  // Iconos para el modal según el tipo
  const ModalIcon = () => {
    switch(modalConfig.type) {
      case 'success':
        return <Check className="w-10 h-10 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-10 h-10 text-red-500" />;
      case 'confirm':
        return <Info className="w-10 h-10 text-blue-500" />;
      default:
        return <Info className="w-10 h-10 text-blue-500" />;
    }
  };

  // Color del botón principal según el tipo de modal
  const modalButtonClass = () => {
    switch(modalConfig.type) {
      case 'success':
        return "bg-green-600 hover:bg-green-700";
      case 'error':
        return "bg-red-600 hover:bg-red-700";
      case 'confirm':
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  const mainBgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const panelBgColor = isDark ? "bg-gray-800/80" : "bg-white";

  return (
    <div className="relative">
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className={`rounded-lg shadow-xl w-full max-w-md transform transition-all ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <ModalIcon />
                <h3 className="text-xl font-bold text-center">{modalConfig.title}</h3>
                <p className="text-center whitespace-pre-line">{modalConfig.message}</p>
              </div>
              
              <div className="mt-6 flex justify-center space-x-3">
                {modalConfig.type === 'confirm' && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (modalConfig.onCancel) modalConfig.onCancel();
                      closeModal();
                    }}
                    className={`px-4 py-2 rounded ${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (modalConfig.onConfirm) modalConfig.onConfirm();
                    closeModal();
                  }}
                  className={`px-4 py-2 rounded text-white ${modalButtonClass()} transition-colors`}
                >
                  {modalConfig.type === 'confirm' ? 'Confirmar' : 'Aceptar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-blue-500" /> Horas Extras Pendientes
              </h2>
              <button 
                onClick={exportToExcel}
                className={`flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors`}
              >
                <FaFileExcel /> Exportar a Excel
              </button>
            </div>
            
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
                      <tr key={registro.id} className={`border-t transition-colors duration-200 ${isDark ? "border-gray-700" : "border-gray-200"
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
                                onClick={(e) => manejarAprobacion(registro.id, 'aprobar', e)}
                                className={`px-3 py-1 rounded text-sm ${
                                  isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                                } text-white`}
                              >
                                Aprobar
                              </button>
                              <button 
                                onClick={(e) => manejarAprobacion(registro.id, 'denegar', e)}
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

            <form onSubmit={crearEmpleado}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                  type="submit"
                  className={`text-white p-2 rounded transition-colors duration-200 ${isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  disabled={!nuevoEmpleado.nombre || !nuevoEmpleado.email || !nuevoEmpleado.password}
                >
                  Agregar Empleado
                </button>
              </div>
            </form>

            {/* Mensaje explicativo */}
            <div className={`mb-4 p-3 rounded ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}>
              <p className="text-sm">
                <strong>Nota:</strong> Todos los usuarios creados tendrán rol de <strong>Empleado</strong>
                <br />y no podrán acceder a funciones administrativas.
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
                          onClick={(e) => eliminarEmpleado(empleado.id, e)}
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