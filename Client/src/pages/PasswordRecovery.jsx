import { useState } from 'react';
import { Link } from 'react-router-dom';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');

  const handlePasswordRecovery = (e) => {
    e.preventDefault();
    alert('Instrucciones de recuperación enviadas');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
        

        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide uppercase text-blue-800">AMADEUS</h1>
          <p className="text-lg text-gray-600 mt-4">
            Ingresa tu correo electrónico. Te enviaremos instrucciones para restablecer tu contraseña.
          </p>
        </div>
        
        <form onSubmit={handlePasswordRecovery}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="correo@ejemplo.com"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition duration-300 mb-4"
          >
            Enviar Instrucciones
          </button>
          
          <div className="text-center">
            <Link 
              to="/login" 
              className="text-blue-600 hover:underline text-lg"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecovery;
