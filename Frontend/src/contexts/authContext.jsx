import { createContext, useEffect, useMemo, useState } from "react";

const apiUrl = import.meta.env.VITE_URL_BACKEND_API;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      let res = await fetch(`${apiUrl}/users/me`, {
        credentials: "include",
      });
      let resJson = await res.json();
      console.log("resJson", resJson);
      if (resJson.data) {
        console.log("ok", resJson);
        setUser(resJson?.data || null);
      } else {
        console.log("Error", resJson);
        return;
      }
    };

    getUserInfo();
  }, []);

  const isLogged = useMemo(() => {
    return user && user.id && user.id > 0;
  }, [user]);

  const urlAvatar = useMemo(() => {
    (user?.userProfile && user?.userProfile?.url_avatar) || null;
  }, [user]);

  const logout = async () => {
    try {
      const res = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      const resJson = await res.json();
      if (!resJson.success) {
        console.log("ERROR logout", resJson);
        return;
      }
      setUser(null);
      setLoading(false);
    } catch (err) {
      console.error("Error logout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthContext.Provider
        value={{ user, setUser, isLogged, urlAvatar, loading, logout }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
