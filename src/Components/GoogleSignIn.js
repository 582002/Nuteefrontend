// src/components/GoogleSignIn.jsx
import React from "react";

const GoogleSignIn = ({ className }) => {
  const onClick = () => {
    // Redirect to backend's oauth2 start endpoint
    // Backend (Spring) will redirect to Google. After success it should redirect to your frontend via controller (you already have that).
    window.location.href = "nutee-eggxarhvdbgsgzbs.southindia-01.azurewebsites.net/oauth2/authorization/google";
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={className || "google-signin-button"}
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;
