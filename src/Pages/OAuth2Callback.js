// src/pages/OAuth2Callback.jsx
import React, { useEffect } from "react";
import authService from "../api/authService";
export default function OAuth2Callback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const fetchProfileAndRedirect = async (authToken) => {
      try {
        // Use the authService to get the profile
        const res = await authService.getProfile();
        // Now save the user details, just like in the regular login
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/"; // Redirect to home
      } catch (error) {
        console.error("Failed to fetch profile after OAuth login", error);
        window.location.href = "/loginSignUp"; // Redirect to login on error
      }
    };

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      // After saving the token, fetch the user profile
      fetchProfileAndRedirect(token);
    } else {
      window.location.href = "/loginSignUp";
    }
  }, []);

  return <div style={{ padding: 24 }}>Signing you in...</div>;
}