import React from 'react';

export default function TermsConditions() {
  return (
    <article className="space-y-6">
      <section className="bg-gradient-to-r from-white to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            T
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Terms & Conditions</h2>
            <p className="text-gray-600 mt-1">
              The rules for using our website and services.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 divide-y divide-gray-200">
        <div className="pt-2">
          <h3 className="text-lg font-semibold">Acceptance of Terms</h3>
          <p className="text-gray-600 mt-2">
            Your use of the website and/or purchase from us are governed by
            following Terms and Conditions. The content of the pages of this
            website is subject to change without notice.
          </p>
        </div>

        <div className="pt-6">
          <h4 className="text-lg font-semibold">
            Disclaimer of Warranty & Liability
          </h4>
          <p className="text-gray-600 mt-2">
            Neither we nor any third parties provide any warranty or guarantee as
            to the accuracy, timeliness, performance, completeness or
            suitability of the information and materials found or offered on
            this website for any particular purpose. You acknowledge that such
            information and materials may contain inaccuracies or errors and we
            expressly exclude liability for any such inaccuracies or errors to
            the fullest extent permitted by law.
          </p>
          <p className="text-gray-600 mt-2">
            Your use of any information or materials on our website and/or
            product pages is entirely at your own risk, for which we shall not
            be liable. It shall be your own responsibility to ensure that any
            products, services or information available meet your specific
            requirements.
          </p>
        </div>

        <div className="pt-6">
          <h4 className="text-lg font-semibold">Intellectual Property</h4>
          <p className="text-gray-600 mt-2">
            Our website contains material which is owned by or licensed to us.
            This material includes, but is not limited to, the design, layout,
            look, appearance and graphics. Reproduction is prohibited other
            than in accordance with the copyright notice. Unauthorized use of
            information provided by us shall give rise to a claim for damages
            and/or be a criminal offense.
          </p>
        </div>

        <div className="pt-6">
          <h4 className="text-lg font-semibold">
            Third-Party Links & Website Use
          </h4>
          <p className="text-gray-600 mt-2">
            From time to time our website may also include links to other
            websites. These links are provided for your convenience to provide
            further information.
          </p>
          <p className="text-gray-600 mt-2">
            You may not create a link to our website from another website or
            document without NeuTee's prior written consent.
          </p>
        </div>

        <div className="pt-6">
          <h4 className="text-lg font-semibold">Governing Law & Disputes</h4>
          <p className="text-gray-600 mt-2">
            Any dispute arising out of use of our website and/or purchase with
            us and/or any engagement with us is subject to the laws of India.
          </p>
          <p className="text-gray-600 mt-2">
            We shall be under no liability whatsoever in respect of any loss or
            damage arising directly or indirectly out of the decline of
            authorization for any Transaction, on Account of the Cardholder
            having exceeded the preset limit mutually agreed by us with our
            acquiring bank from time to time.
          </p>
        </div>
      </div>
    </article>
  );
}