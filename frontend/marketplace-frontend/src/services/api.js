// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8080",
// });

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default API;
// 

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// 🔐 REQUEST INTERCEPTOR (attach token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 RESPONSE INTERCEPTOR (handle errors globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {

    const status = error.response?.status;

    // 🔴 Token expired / unauthorized
    if (status === 401) {
      localStorage.removeItem("token");

      alert("Session expired. Please login again.");

      window.location.href = "/login";
    }

    // 🔴 Server error
    if (status === 500) {
      console.error("Server Error:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default API;