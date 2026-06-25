import React from 'react';

export default function CancellationRefund() {
  return (
    <article className="space-y-6">
      <section className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            C
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Cancellation & Refund</h2>
            <p className="text-gray-600 mt-1">
              How cancellations and refund processing are handled at NeuTee.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold">Order Cancellation</h3>
        <p className="text-gray-600 mt-3">
          NeuTee believes in helping its customers as far as possible and has a
          liberal cancellation policy.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Cancellation Window</h4>
            <p className="text-sm text-gray-600 mt-2 space-y-1">
              Cancellations will be considered only if the request is made
              within 2 days of placing the order.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Exceptions</h4>
            <p className="text-sm text-gray-600 mt-2">
              The cancellation request may not be entertained if the orders have
              been communicated to the vendors/merchants and they have initiated
              the process of shipping them.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
          <strong className="text-indigo-700">Refund Processing:</strong>
          <span className="text-gray-700 ml-2">
            In case of any Refunds approved by the NeuTee, it'll take 1-2 days
            for the refund to be processed to the end customer.
          </span>
        </div>
      </div>
    </article>
  );
}