import React from "react";
import Trendy from "../Components/Home/Trendy/Trendy";
import FloatingWhatsApp from "../Components/FloatingWhatsApp";
import Hero from "../Components/Home/Hero/Heroo";
import Previews from "../Components/Home/Banner/Banner";

const ModHome = () => {
  return (
    <>
      <Hero />  
      <Trendy />
      <Previews/>
      <FloatingWhatsApp />
    </>
  );
};

export default ModHome;
