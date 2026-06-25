import React from 'react';

export default function PrivacyPolicy() {
  return (
    <article className="space-y-6">
      <section className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            P
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Privacy Policy</h2>
            <p className="text-gray-600 mt-1">
              How we collect, use and protect your information.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white p-6 rounded-2xl shadow-md divide-y divide-gray-200">
        <div className="py-4">
          <h3 className="text-lg font-semibold">Information we collect</h3>
          <p className="text-gray-600 mt-3">
            We may collect the following information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-3 space-y-1">
            <li>Name</li>
            <li>Contact information including email address</li>
            <li>
              Demographic information such as postcode, preferences and
              interests, if required
            </li>
            <li>Other information relevant to customer surveys and/or offers</li>
          </ul>
        </div>

        <div className="py-4">
          <h4 className="text-lg font-semibold">
            What we do with the information we gather
          </h4>
          <p className="text-gray-600 mt-2">
            We require this information to understand your needs and provide you
            with a better service, and in particular for the following reasons:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-3 space-y-1">
            <li>Internal record keeping.</li>
            <li>We may use the information to improve our products and services.</li>
            <li>
              We may periodically send promotional emails about new products or
              special offers.
            </li>
            <li>
              From time to time, we may also use your information to contact you
              for market research purposes.
            </li>
          </ul>
        </div>

        <div className="py-4">
          <h4 className="text-lg font-semibold">Security</h4>
          <p className="text-gray-600 mt-2">
            We are committed to ensuring that your information is secure. In
            order to prevent unauthorised access or disclosure we have put in
            suitable measures.
          </p>
        </div>

        <div className="py-4">
          <h4 className="text-lg font-semibold">How we use cookies</h4>
          <p className="text-gray-600 mt-2">
            A cookie is a small file which asks permission to be placed on your
            computer's hard drive. We use traffic log cookies to identify
            which pages are being used. This helps us analyze data about
            webpage traffic and improve our website. We only use this
            information for statistical analysis purposes. A cookie in no way
            gives us access to your computer or any information about you,
            other than the data you choose to share with us.
          </p>
        </div>

        <div className="py-4">
          <h4 className="text-lg font-semibold">
            Controlling your personal information
          </h4>
          <p className="text-gray-600 mt-2">
            You may choose to restrict the collection or use of your personal
            information. If you have previously agreed to us using your
            personal information for direct marketing purposes, you may change
            your mind at any time by writing to or emailing us at
            <strong className="text-gray-800"> neuteeclothing@gmail.com</strong>.
          </p>
          <p className="text-gray-600 mt-2">
            We will not sell, distribute or lease your personal information to
            third parties unless we have your permission or are required by law
            to do so.
          </p>
          <p className="text-gray-600 mt-2">
            If you believe that any information we are holding on you is
            incorrect or incomplete, please contact us as soon as possible. We
            will promptly correct any information found to be incorrect.
          </p>
        </div>
      </div>
    </article>
  );
}