import React from 'react';

export default function ShippingPolicy() {
  return (
    <article className="space-y-6">
      <section className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            S
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Shipping Policy</h2>
            <p className="text-gray-600 mt-1">
              Timelines, carriers, and delivery norms.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <h3 className="text-lg font-semibold">Processing & Delivery</h3>
        <p className="text-gray-600">
          Orders are shipped within 0-7 days from the date of the order and
          payment or as per the delivery date agreed at the time of order
          confirmation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Domestic Buyers</h4>
            <p className="text-sm text-gray-600 mt-2">
              Orders are shipped through registered domestic courier companies
              and/or speed post only.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">International Buyers</h4>
            <p className="text-sm text-gray-600 mt-2">
              Orders are shipped and delivered through registered international
              courier companies and/or International speed post only.
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
          <strong className="text-indigo-700">Delivery Confirmation</strong>
          <p className="text-gray-700 mt-1">
            Delivery of all orders will be to the address provided by the buyer.
            Delivery of our services will be confirmed on your mail ID as
            specified during registration.
          </p>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <strong className="text-yellow-800">Note on Delays</strong>
          <p className="text-gray-700 mt-1">
            NeuTee is not liable for any delay in delivery by the courier
            company / postal authorities and only guarantees to hand over the
            consignment to them within 0-7 days.
          </p>
        </div>
      </div>
    </article>
  );
}