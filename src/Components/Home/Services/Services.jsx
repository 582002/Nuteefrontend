import React from "react";
import { MdDesignServices } from "react-icons/md";
import { RiPrinterCloudLine, RiCustomerService2Line } from "react-icons/ri";

const Services = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-10 px-4 sm:px-16 lg:px-40 my-20">
      {/* Design Services */}
      <div className="flex flex-col items-center text-center">
        <MdDesignServices size={50} className="text-primary mb-5" />
        <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">
          Creative Design Services
        </h3>
        <ul className="text-gray-600 text-sm list-disc list-inside text-left">
          <li>Custom logo creation</li>
          <li>Design consultation</li>
          <li>File preparation & optimization</li>
          <li>Brand identity development</li>
        </ul>
      </div>

      {/* Printing Services */}
      <div className="flex flex-col items-center text-center">
        <RiPrinterCloudLine size={50} className="text-primary mb-5" />
        <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">
          Advanced Printing Services
        </h3>
        <ul className="text-gray-600 text-sm list-disc list-inside text-left">
          <li>Direct-to-Garment printing</li>
          <li>Heat transfer vinyl application</li>
          <li>Screen printing (bulk orders)</li>
          <li>Quality control & finishing</li>
        </ul>
      </div>

      {/* Customer Support */}
      <div className="flex flex-col items-center text-center">
        <RiCustomerService2Line size={50} className="text-primary mb-5" />
        <h3 className="text-lg font-semibold uppercase tracking-wide mb-2">
          Reliable Support
        </h3>
        <p className="text-gray-600 text-sm max-w-xs">
          Friendly 24/7 assistance from our Hyderabad-based support team.
        </p>
      </div>
    </div>
  );
};

export default Services;
