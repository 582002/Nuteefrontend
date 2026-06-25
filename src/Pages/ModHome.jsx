import React from "react";
import Banner from "../Components/Home/Banner/Banner";
import CollectionBox from "../Components/Home/Collection/CollectionBox";
import Services from "../Components/Home/Services/Services";
import Instagram from "../Components/Home/Instagram/Instagram";
import Trendy from "../Components/Home/Trendy/Trendy";
import LimitedEdition from "../Components/Home/Limited/LimitedEdition";
import DealTimer from "../Components/Home/Deal/DealTimer";
import HeroSection from "../Components/Home/Hero/HeroSection";
import ContactUs from "../Components/Contact/ContactUs";
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
