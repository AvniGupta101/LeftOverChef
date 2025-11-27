// // // src/context/AuthContext.jsx
// // import React, { createContext, useState, useEffect } from "react";
// // import { api } from "../api/client";

// // // eslint-disable-next-line react-refresh/only-export-components
// // export const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(() => {
// //     try {
// //       return JSON.parse(localStorage.getItem("user")) || null;
// //     } catch (e) {
// //       return null;
// //     }
// //   });
// //   const [token, setToken] = useState(() => localStorage.getItem("token") || null);
// //   const [loading, setLoading] = useState(false);

// //   // Attach token to axios globally and persist token
// //   useEffect(() => {
// //     if (token) {
// //       api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //       localStorage.setItem("token", token);
// //     } else {
// //       delete api.defaults.headers.common["Authorization"];
// //       localStorage.removeItem("token");
// //     }
// //   }, [token]);

// //   // Keep user in localStorage
// //   useEffect(() => {
// //     if (user) localStorage.setItem("user", JSON.stringify(user));
// //     else localStorage.removeItem("user");
// //   }, [user]);

// //   // LOGIN - returns { success, user, token } on success
// //   async function login(email, password) {
// //     try {
// //       setLoading(true);
// //       const res = await api.post("/auth/login", { email, password });
// //       // Expecting backend to return { token, user } in res.data
// //       const { token: tkn, user: usr } = res.data || {};
// //       if (!tkn || !usr) {
// //         // fallback if backend has different shape
// //         return { success: false, message: "Invalid login response from server" };
// //       }
// //       setUser(usr);
// //       setToken(tkn);
// //       return { success: true, user: usr, token: tkn };
// //     } catch (err) {
// //       console.error("Login failed:", err.response?.data || err.message);
// //       return { success: false, message: err.response?.data?.error || "Login failed" };
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // REGISTER - registers and then logs the user in automatically if possible
// //   // default role is 'donor'
// //   async function register(name, email, password, role = "donor") {
// //     try {
// //       setLoading(true);
// //       const res = await api.post("/auth/register", { name, email, password, role });
// //       // If backend returns token+user directly on register (some backends do), use it:
// //       if (res?.data?.token && res?.data?.user) {
// //         const { token: tkn, user: usr } = res.data;
// //         setUser(usr);
// //         setToken(tkn);
// //         return { success: true, user: usr, token: tkn };
// //       }

// //       // Otherwise, attempt to auto-login using the same credentials:
// //       const loginResult = await login(email, password);
// //       if (loginResult.success) {
// //         return { success: true, user: loginResult.user, token: loginResult.token, message: "Registered & logged in" };
// //       }

// //       // fallback: registration succeeded but auto-login failed
// //       if (res.status === 200 || res.status === 201) {
// //         return { success: true, message: res.data?.message || "Registered successfully. Please log in." };
// //       }

// //       return { success: false, message: res.data?.message || "Registration failed" };
// //     } catch (err) {
// //       console.error("Registration failed:", err.response?.data || err.message);
// //       return { success: false, message: err.response?.data?.error || "Registration failed" };
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   function logout() {
// //     setUser(null);
// //     setToken(null);
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("user");
// //   }

// //   const value = {
// //     user,
// //     token,
// //     loading,
// //     login,
// //     register,
// //     logout,
// //     isAuthenticated: !!token,
// //   };

// //   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// // }
// // src/context/AuthContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import { api } from "../api/client";

// // eslint-disable-next-line react-refresh/only-export-components
// export const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     // token format: header.payload.signature
//     const payload = token.split(".")[1];
//     if (!payload) return null;
//     // atob decodes base64 in browser
//     const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
//     return decoded;
//   } catch (e) {
//     console.warn("Failed to parse JWT:", e);
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user")) || null;
//     } catch (e) {
//       return null;
//     }
//   });
//   const [token, setToken] = useState(() => localStorage.getItem("token") || null);
//   const [loading, setLoading] = useState(false);

//   // Attach token to axios globally and persist token
//   useEffect(() => {
//     if (token) {
//       api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       localStorage.setItem("token", token);
//     } else {
//       delete api.defaults.headers.common["Authorization"];
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   // If token exists but user is not populated, try to decode token to seed user state
//   useEffect(() => {
//     if (!user && token) {
//       const payload = parseJwt(token);
//       if (payload) {
//         // payload keys depend on how token was signed; adjust if your token uses different claims
//         const seededUser = {
//           id: payload.id || payload._id || payload.userId || null,
//           name: payload.name || payload.fullName || null,
//           email: payload.email || null,
//           role: payload.role || null,
//         };
//         // only set if we have at least an id or email
//         if (seededUser.id || seededUser.email) {
//           setUser(seededUser);
//         }
//       }
//     }
//   }, [token, user]);

//   // Keep user in localStorage
//   useEffect(() => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [user]);

//   // LOGIN - returns { success, user, token } on success
//   async function login(email, password) {
//     try {
//       setLoading(true);
//       const res = await api.post("/auth/login", { email, password });
//       // Expecting backend to return { token, user } in res.data
//       const { token: tkn, user: usr } = res.data || {};
//       if (!tkn || !usr) {
//         // fallback if backend has different shape
//         return { success: false, message: "Invalid login response from server" };
//       }
//       setUser(usr);
//       setToken(tkn);
//       return { success: true, user: usr, token: tkn };
//     } catch (err) {
//       console.error("Login failed:", err.response?.data || err.message);
//       return { success: false, message: err.response?.data?.error || "Login failed" };
//     } finally {
//       setLoading(false);
//     }
//   }

//   // REGISTER - registers and then logs the user in automatically if possible
//   async function register(name, email, password, role = "donor") {
//     try {
//       setLoading(true);
//       const res = await api.post("/auth/register", { name, email, password, role });
//       // If backend returns token+user directly on register (some backends do), use it:
//       if (res?.data?.token && res?.data?.user) {
//         const { token: tkn, user: usr } = res.data;
//         setUser(usr);
//         setToken(tkn);
//         return { success: true, user: usr, token: tkn };
//       }

//       // Otherwise, attempt to auto-login using the same credentials:
//       const loginResult = await login(email, password);
//       if (loginResult.success) {
//         return { success: true, user: loginResult.user, token: loginResult.token, message: "Registered & logged in" };
//       }

//       // fallback: registration succeeded but auto-login failed
//       if (res.status === 200 || res.status === 201) {
//         return { success: true, message: res.data?.message || "Registered successfully. Please log in." };
//       }

//       return { success: false, message: res.data?.message || "Registration failed" };
//     } catch (err) {
//       console.error("Registration failed:", err.response?.data || err.message);
//       return { success: false, message: err.response?.data?.error || "Registration failed" };
//     } finally {
//       setLoading(false);
//     }
//   }

//   function logout() {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   }

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!token,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { api } from "../api/client";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch (e) {
    console.warn("Failed to parse JWT:", e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Attach token to axios globally and persist token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // If token exists but user is not populated, decode token to seed user state
  useEffect(() => {
    if (!user && token) {
      const payload = parseJwt(token);
      if (payload) {
        const seededUser = {
          _id: payload.id || payload._id || payload.userId || null,
          id: payload.id || payload._id || payload.userId || null,
          name: payload.name || payload.fullName || null,
          email: payload.email || null,
          role: payload.role || null,
        };
        // only set if we have at least an id or email
        if (seededUser.id || seededUser.email) {
          console.log('Seeded user from token:', seededUser);
          setUser(seededUser);
        }
      }
    }
  }, [token, user]);

  // Keep user in localStorage
  useEffect(() => {
    if (user) {
      console.log('Saving user to localStorage:', user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // LOGIN - returns { success, user, token } on success
  async function login(email, password) {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      const { token: tkn, user: usr } = res.data || {};
      
      if (!tkn || !usr) {
        return { success: false, message: "Invalid login response from server" };
      }
      
      // Ensure both _id and id are set
      const normalizedUser = {
        ...usr,
        _id: usr._id || usr.id,
        id: usr.id || usr._id
      };
      
      console.log('Login successful, normalized user:', normalizedUser);
      
      setUser(normalizedUser);
      setToken(tkn);
      return { success: true, user: normalizedUser, token: tkn };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.error || "Login failed" };
    } finally {
      setLoading(false);
    }
  }

  // REGISTER
  async function register(name, email, password, role = "donor") {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", { name, email, password, role });
      
      if (res?.data?.token && res?.data?.user) {
        const { token: tkn, user: usr } = res.data;
        const normalizedUser = {
          ...usr,
          _id: usr._id || usr.id,
          id: usr.id || usr._id
        };
        setUser(normalizedUser);
        setToken(tkn);
        return { success: true, user: normalizedUser, token: tkn };
      }

      const loginResult = await login(email, password);
      if (loginResult.success) {
        return { 
          success: true, 
          user: loginResult.user, 
          token: loginResult.token, 
          message: "Registered & logged in" 
        };
      }

      if (res.status === 200 || res.status === 201) {
        return { 
          success: true, 
          message: res.data?.message || "Registered successfully. Please log in." 
        };
      }

      return { success: false, message: res.data?.message || "Registration failed" };
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return { 
        success: false, 
        message: err.response?.data?.error || "Registration failed" 
      };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}