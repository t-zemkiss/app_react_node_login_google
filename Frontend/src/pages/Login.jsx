import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

const apiUrlGoogle = import.meta.env.VITE_URL_BACKEND_GOOGLE_AUTH;
const apiUrl = import.meta.env.VITE_URL_BACKEND_API;

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    const getUserInfo = async () => {
      let res = await fetch(`${apiUrl}/users/me`, {
        credentials: "include",
      });
      let resJson = await res.json();
      if (!resJson) {
        console.log("Error", resJson);
        return;
      } else {
        console.log("ok", resJson);
        setUser(resJson?.data || {});
        navigate('/');
      }
    };

    getUserInfo();
  }, []);


  const handleBtnGoogle = (urlAuth) => {
    console.log(urlAuth);
    window.location.href = urlAuth;
  };

  return (
    <div className="w-full pt-16 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Inicia sesión en tu cuenta
        </h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>

        {/* Separador */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-sm text-gray-500">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span
            className="text-gray-700 font-medium"
            onClick={() => handleBtnGoogle(apiUrlGoogle)}
          >
            Continuar con Google
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-blue-600 font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
