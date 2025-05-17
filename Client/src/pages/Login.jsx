import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { FaSpinner } from 'react-icons/fa';
 
const schema = yup.object({
  email: yup.string().email("Debe ser un email válido").required("El email es requerido."),
  password: yup.string().required("La contraseña es requerida."),
}).required();
 
const Login = () => {
  const dispatch = useDispatch();
  const { loading, error, token, user } = useSelector((state) => state.auth);
 
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
 
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
 
  useEffect(() => {
    if (token && user) {
      if(user.roleId === 1) {
        navigate("/admin-panel");
      } else if(user.roleId === 2) {
        navigate("/dashboard");
      }
    }
  }, [token, navigate]);
 
  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (error) {
      // El error ya se muestra desde el estado de Redux
      console.error("Error en login:", error);
    }
  };
 
  useEffect(() => {
    let interval;
   
    const removeSplineLogo = () => {
      interval = setInterval(() => {
        const viewer = document.querySelector('spline-viewer');
        if (viewer && viewer.shadowRoot) {
          const logo = viewer.shadowRoot.querySelector('#logo');
          if (logo) {
            logo.remove();
            console.log("Logo removed!");
            clearInterval(interval);
          }
        }
      }, 500);
    };
 
    removeSplineLogo();
 
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="w-full max-w-4xl flex rounded-xl overflow-hidden shadow-2xl">
       
        <div className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative">
         
          <h1 className="text-2xl font-extrabold tracking-wide uppercase absolute top-6 left-6 z-10">AMADEUS</h1>
         
          <div className="absolute inset-0 opacity-40">
            <spline-viewer
              url="https://prod.spline.design/HcyR2qwOwEPfr7wU/scene.splinecode"
              className="w-full h-full"
              loading="eager"
            ></spline-viewer>
          </div>
        </div>
 
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-blue-800 mb-6">Acceso al sistema</h3>
          <p className="mb-6 text-gray-600">Ingresa tus credenciales para continuar</p>
         
          {/* Mensaje de error general */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
 
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Correo electrónico</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none
                  ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
           
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none
                  ${errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
           
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span>Recordarme</span>
              </div>
              <Link
                to="/password-recovery"
                className="text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
 
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition duration-300 flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default Login;
 