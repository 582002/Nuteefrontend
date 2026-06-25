// src/utils/jwtHelper.js
import {jwtDecode} from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => localStorage.getItem("token");

export const removeToken = () => localStorage.removeItem("token");

export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token); // returns decoded payload
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
