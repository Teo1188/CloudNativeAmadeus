import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FaSearch } from "react-icons/fa";
import api from '../api/axiosInstance';

const ExtraHoursPanel = () => {
  const { isDark } = useTheme();
  const [registros, setRegistros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [extraHourTypes, setExtraHourTypes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [roles, setRoles] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    userId: "",
    date: "",
    startTime: "",
    endTime: "",
    extraHourTypeId: "",
    reason: "",
    status: "Pendiente"
  });

  const [totalHours, setTotalHours] = useState(0);
  const [overtimeData, setOvertimeData] = useState({
    totalHoras: 0,
    horasAprobadas: 0,
    horasPendientes: 0
  });

  // Función para calcular y redondear horas
  const calculateRoundedHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = (end - start) / (1000 * 60 * 60);
    return Math.round(diff > 0 ? diff : 0);
  };

  // Calcular resumen de horas extras
  const calculateOvertimeSummary = (registros) => {
    let total = 0;
    let aprobadas = 0;
    let pendientes = 0;

    registros.forEach(registro => {
      const horas = calculateRoundedHours(registro.startTime, registro.endTime);
      total += horas;
      
      if (registro.status === "Aprobado") {
        aprobadas += horas;
      } else if (registro.status === "Pendiente") {
        pendientes += horas;
      }
    });

    setOvertimeData({
      totalHoras: total,
      horasAprobadas: aprobadas,
      horasPendientes: pendientes
    });
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar empleados
        const usersResponse = await api.get('/api/users');
        setEmpleados(usersResponse.data);
        
        // Cargar tipos de horas extras
        const typesResponse = await api.get('/api/extra-hour-types');
        setExtraHourTypes(typesResponse.data);
        
        // Cargar registros existentes
        const overtimeResponse = await api.get('/api/extra-hours');
        setRegistros(overtimeResponse.data);
        calculateOvertimeSummary(overtimeResponse.data);
        
        // Cargar roles
        const rolesResponse = await api.get('/api/roles');
        setRoles(rolesResponse.data);
        
        // Cargar departamentos
        const deptResponse = await api.get('/api/departments');
        setDepartamentos(deptResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error al cargar datos iniciales");
      }
    };
    
    loadInitialData();
  }, []);

  // Calcular total de horas en el formulario
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diff = (end - start) / (1000 * 60 * 60);
      setTotalHours(diff > 0 ? diff : 0);
    }
  }, [formData.startTime, formData.endTime]);

  // Actualizar resumen cuando cambian los registros
  useEffect(() => {
    calculateOvertimeSummary(registros);
  }, [registros]);

  // Filtrar empleados basado en búsqueda
  const empleadosFiltrados = empleados.filter(emp =>
    emp.name && emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  // Manejar selección de empleado
  const handleEmployeeSelect = (empleado) => {
    const selected = {
      ...empleado,
      role: {
        name: roles.find(r => r.id === empleado.roleId)?.name || "Sin rol"
      },
      department: {
        name: departamentos.find(d => d.id === empleado.departmentId)?.name || "Sin departamento"
      }
    };
    
    setSelectedEmployee(selected);
    setEmployeeSearchTerm(selected.name);
    setShowEmployeeDropdown(false);
    setFormData({
      ...formData,
      userId: selected.id
    });
  };

  // Manejar cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validar el formulario
  const validateForm = () => {
    const errors = [];
    
    if (!selectedEmployee) errors.push("Debe seleccionar un empleado");
    if (!formData.date) errors.push("La fecha es requerida");
    if (!formData.startTime) errors.push("La hora de inicio es requerida");
    if (!formData.endTime) errors.push("La hora de fin es requerida");
    if (!formData.extraHourTypeId) errors.push("El tipo de hora extra es requerido");
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) errors.push("La hora de fin debe ser posterior a la hora de inicio");
    }
    
    return errors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Errores:\n${errors.join("\n")}`);
      return;
    }
    
    try {
      const selectedType = extraHourTypes.find(t => t.id === formData.extraHourTypeId);
      
      const dataToSend = {
        userId: selectedEmployee.id,
        date: new Date(formData.date).toISOString(),
        startTime: formData.startTime.includes(':') ? formData.startTime : `${formData.startTime}:00`,
        endTime: formData.endTime.includes(':') ? formData.endTime : `${formData.endTime}:00`,
        extraHourTypeId: formData.extraHourTypeId,
        reason: formData.reason || null,
        status: "pendiente",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await api.post('/api/extra-hours', dataToSend);
      setRegistros([...registros, response.data]);
      
      // Resetear formulario
      setFormData({
        userId: "",
        date: "",
        startTime: "",
        endTime: "",
        extraHourTypeId: "",
        reason: "",
        status: "Pendiente"
      });
      setSelectedEmployee(null);
      setEmployeeSearchTerm("");
      setTotalHours(0);
      
      alert("Horas extras registradas correctamente!");
      
    } catch (error) {
      console.error("Error al registrar:", error.response?.data || error.message);
      let errorMessage = "Error al registrar horas extras";
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'object' 
          ? JSON.stringify(error.response.data) 
          : error.response.data;
      }
      alert(errorMessage);
    }
  };

  // Estilos dinámicos
  const mainBgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const panelBgColor = isDark ? "bg-gray-800/80" : "bg-white";
  const inputStyle = `p-2 border rounded ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`;

  return (
    <div className={`min-h-screen w-full ${mainBgColor} text-${isDark ? "white" : "gray-800"} transition-colors duration-200`}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Resumen de Horas Extras */}
        <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
          <h3 className="text-xl font-bold mb-4">Resumen de Horas Extras</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
              isDark ? "bg-blue-900/30" : "bg-blue-50"
            }`}>
              <Clock className="mx-auto mb-3 text-blue-500" size={40} />
              <h4 className={`text-base transition-colors duration-200 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>Total horas extra trabajadas</h4>
              <p className="text-2xl font-bold text-blue-600">{overtimeData.totalHoras}</p>
            </div>
            <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
              isDark ? "bg-green-900/30" : "bg-green-50"
            }`}>
              <Clock className="mx-auto mb-3 text-green-500" size={40} />
              <h4 className={`text-base transition-colors duration-200 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>Horas aprobadas por administrador</h4>
              <p className="text-2xl font-bold text-green-600">{overtimeData.horasAprobadas}</p>
            </div>
            <div className={`p-5 rounded-lg text-center transition-colors duration-200 ${
              isDark ? "bg-yellow-900/30" : "bg-yellow-50"
            }`}>
              <Clock className="mx-auto mb-3 text-yellow-500" size={40} />
              <h4 className={`text-base transition-colors duration-200 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>Horas pendientes por aprobar</h4>
              <p className="text-2xl font-bold text-yellow-600">{overtimeData.horasPendientes}</p>
            </div>
          </div>
        </div>

        {/* Formulario de Registro */}
        <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
          <h2 className="text-xl font-bold mb-4">Registrar Horas Extras</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Sección de Información del Empleado */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Información del Empleado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Buscador de Empleados */}
                <div className="relative">
                  <label className="block mb-1">Nombre del Empleado</label>
                  <div className="flex items-center border rounded overflow-hidden">
                    <FaSearch className="ml-2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar empleado..."
                      className={`p-2 flex-grow outline-none ${isDark ? "bg-gray-700 text-white" : "bg-white"}`}
                      value={employeeSearchTerm}
                      onChange={(e) => {
                        setEmployeeSearchTerm(e.target.value);
                        setShowEmployeeDropdown(true);
                        if (!e.target.value) {
                          setSelectedEmployee(null);
                          setFormData({...formData, userId: ""});
                        }
                      }}
                      onFocus={() => setShowEmployeeDropdown(true)}
                      onBlur={() => setTimeout(() => setShowEmployeeDropdown(false), 200)}
                    />
                  </div>
                  {showEmployeeDropdown && employeeSearchTerm && (
                    <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-auto border rounded shadow-lg ${
                      isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    }`}>
                      {empleadosFiltrados.length > 0 ? (
                        empleadosFiltrados.map(empleado => (
                          <div 
                            key={empleado.id}
                            className={`p-2 hover:bg-blue-100 cursor-pointer ${
                              isDark ? "hover:bg-gray-600" : "hover:bg-blue-50"
                            }`}
                            onClick={() => handleEmployeeSelect(empleado)}
                          >
                            {empleado.name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No se encontraron empleados</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Rol (auto-completado) */}
                <div>
                  <label className="block mb-1">Rol</label>
                  <input
                    type="text"
                    className={`${inputStyle} w-full`}
                    value={selectedEmployee?.role?.name || ""}
                    readOnly
                  />
                </div>

                {/* Departamento (auto-completado) */}
                <div>
                  <label className="block mb-1">Departamento</label>
                  <input
                    type="text"
                    className={`${inputStyle} w-full`}
                    value={selectedEmployee?.department?.name || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Sección de Detalles de Horas Extras */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Detalles de las Horas Extras</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Fecha */}
                <div>
                  <label className="block mb-1">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    className={`${inputStyle} w-full`}
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Hora de Inicio */}
                <div>
                  <label className="block mb-1">Hora de Inicio</label>
                  <input
                    type="time"
                    name="startTime"
                    className={`${inputStyle} w-full`}
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    step="3600"
                  />
                </div>

                {/* Hora de Fin */}
                <div>
                  <label className="block mb-1">Hora de Fin</label>
                  <input
                    type="time"
                    name="endTime"
                    className={`${inputStyle} w-full`}
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    step="3600"
                  />
                </div>

                {/* Total de Horas (auto-calculado) - Mostrado como entero */}
                <div>
                  <label className="block mb-1">Total de Horas</label>
                  <input
                    type="text"
                    className={`${inputStyle} w-full`}
                    value={`${Math.round(totalHours)} horas`}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Tipo de Hora Extra */}
                <div>
                  <label className="block mb-1">Tipo de Hora Extra</label>
                  <select
                    name="extraHourTypeId"
                    className={`${inputStyle} w-full`}
                    value={formData.extraHourTypeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    {extraHourTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                {/* Razón/Motivo */}
                <div>
                  <label className="block mb-1">Razón/Motivo</label>
                  <input
                    type="text"
                    name="reason"
                    className={`${inputStyle} w-full`}
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                isDark ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
              disabled={!selectedEmployee}
            >
              Registrar Horas Extras
            </button>
          </form>
        </div>

        {/* Listado de Registros */}
        <div className={`p-6 rounded-lg shadow transition-colors duration-200 ${panelBgColor}`}>
          <h2 className="text-xl font-bold mb-4">Historial de Horas Extras</h2>
          
          {/* Buscador */}
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar registros..."
                className={`pl-10 p-2 border rounded-full w-full ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla de resultados */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`text-left ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  <th className="p-3">Empleado</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Horas</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Total Horas</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros
                  .filter(registro => 
                    registro.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    registro.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    registro.extraHourType?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(registro => {
                    const horasTotales = calculateRoundedHours(registro.startTime, registro.endTime);
                    
                    return (
                      <tr key={registro.id} className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                        <td className="p-3">{registro.user?.name}</td>
                        <td className="p-3">{new Date(registro.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          {registro.startTime} - {registro.endTime}
                        </td>
                        <td className="p-3">{registro.extraHourType?.name}</td>
                        <td className="p-3 font-medium">
                          {horasTotales} horas
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            registro.status === "Pendiente" 
                              ? isDark ? "bg-yellow-800/50 text-yellow-200" : "bg-yellow-100 text-yellow-800" 
                              : isDark ? "bg-green-800/50 text-green-200" : "bg-green-100 text-green-800"
                          }`}>
                            {registro.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button 
                            className={`px-3 py-1 rounded mr-2 ${
                              isDark ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-800"
                            } transition-colors duration-200`}
                          >
                            Editar
                          </button>
                          <button 
                            className={`px-3 py-1 rounded ${
                              isDark ? "bg-red-700 text-white" : "bg-red-100 text-red-800"
                            } transition-colors duration-200`}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraHoursPanel;