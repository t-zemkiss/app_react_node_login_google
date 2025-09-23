import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/authContext";

export default function Navbar() {

  const {isLogged, urlAvatar ,logout} = useContext(AuthContext);

  useEffect(()=>{
console.log('isLogged en navbar',isLogged);
  },[isLogged])

  const [open, setOpen] = useState(false);
  const [menuUser, setMenuUser] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-blue-600">Mi</span>Logo
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-blue-500 transition-colors">
              Inicio
            </Link>
            <Link
              to="/contacto"
              className="hover:text-blue-500 transition-colors"
            >
              Contacto
            </Link>

            {/* Usuario */}
            {!isLogged ? (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <LogIn className="w-5 h-5" />
                Entrar
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuUser(!menuUser)}
                  className="flex items-center focus:outline-none cursor-pointer"
                >
                  <img
                    src={
                      urlAvatar ||
                      "https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-500 shadow"
                  />
                </button>

                {/* Submenu */}
                <AnimatePresence>
                  {menuUser && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl overflow-hidden shadow-xl border bg-white"
                    >
                      <Link
                        to="/perfil"
                        className="block px-4 py-3 hover:bg-blue-50 transition"
                        onClick={() => setMenuUser(false)}
                      >
                        Perfil
                      </Link>
                      <Link
                        to="/ajustes"
                        className="block px-4 py-3 hover:bg-blue-50 transition"
                        onClick={() => setMenuUser(false)}
                      >
                        Ajustes
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-500 transition"
                      >
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Botón hamburguesa móvil */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)} className="relative w-8 h-8">
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-7 h-7" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-7 h-7" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden px-6 py-4 space-y-4 bg-white text-gray-800 shadow-lg"
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="block hover:text-blue-500"
            >
              Inicio
            </Link>
            <Link
              to="/servicios"
              onClick={() => setOpen(false)}
              className="block hover:text-blue-500"
            >
              Servicios
            </Link>
            <Link
              to="/contacto"
              onClick={() => setOpen(false)}
              className="block hover:text-blue-500"
            >
              Contacto
            </Link>
            {!isLogged && (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <LogIn className="w-5 h-5" />
                Entrar
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
