import React from "react";
import Banner from "../Components/Home/Banner/Banner";
import CollectionBox from "../Components/Home/Collection/CollectionBox";
import Services from "../Components/Home/Services/Services";
import HeroSection from "../Components/Home/Hero/HeroSection";
import ContactUs from "../Components/Contact/ContactUs";
import FloatingWhatsApp from "../Components/FloatingWhatsApp";

const Home = () => {
  return (
    <>
      <HeroSection />  
      <CollectionBox />
 
      {/* <DealTimer /> */}
      <Banner />
      {/* <LimitedEdition /> */}
      {/* <Instagram /> */}
      <Services />
      <FloatingWhatsApp />
      <ContactUs/>
    </>
  );
};

export default Home;
