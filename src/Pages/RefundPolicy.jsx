import React from 'react';

export default function RefundPolicy() {
  return (
    <article className="space-y-6">
      <section className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            R
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Refund Policy</h2>
            <p className="text-gray-600 mt-1">
              Details about returns, eligibility, and timelines for issues.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold">Returns & Eligibility</h3>
        <p className="text-gray-600 mt-3">
          Refunds or replacements are handled for specific cases. Please see
          the conditions below.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2">Issue</th>
                <th className="py-2">Report Within</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-3">Damaged or defective items</td>
                <td className="py-3">2 days of receipt</td>
                <td className="py-3">
                  Refund/Replacement after merchant verification
                </td>
              </tr>
              <tr>
                <td className="py-3">Product not as shown on site</td>
                <td className="py-3">2 days of receipt</td>
                <td className="py-3">
                  Customer Service will review & decide
                </td>
              </tr>
              <tr>
                <td className="py-3">Manufacturer warranty issues</td>
                <td className="py-3">N/A</td>
                <td className="py-3">Please refer the issue to them</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">How refunds are processed</h4>
            <p className="text-sm text-gray-600 mt-2">
              For damaged/defective items, the request will be entertained once
              the merchant has checked and determined the issue. For other
              complaints, the Customer Service Team will take an appropriate
D              decision.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium">Manufacturer Warranties</h4>
            <p className="text-sm text-gray-600 mt-2">
              In case of complaints regarding products that come with a warranty
              from manufacturers, please refer the issue to them directly.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}