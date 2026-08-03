import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            FutureGPT ("we", "us", "our") values your privacy. This policy
            explains how we collect, use, disclose, and safeguard your personal
            data when you interact with our community, services, or website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Information We Collect
          </h2>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2.1 Personal Information
          </h3>
          <p className="text-gray-700 mb-4">
            Name, email address, phone number, company, role/title, and location
            when you sign up, contact us, request information, or use our
            services.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2.2 Usage Information
          </h3>
          <p className="text-gray-700 mb-4">
            IP address, browser type, device information, pages visited, time
            spent on website, referral URLs, and similar analytics data.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            2.3 Sensitive / Technical Data
          </h3>
          <p className="text-gray-700">
            For specific engagements or programs, we may collect limited
            technical data about systems or applications as explicitly agreed
            with you and only as necessary for the activity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Use of Information
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              To respond to inquiries, manage accounts, and provide requested
              services or community features.
            </li>
            <li>
              To improve our website, products, and services; perform analytics;
              and support marketing.
            </li>
            <li>
              To send updates, newsletters, or promotional content when you have
              provided consent (where required).
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Disclosure of Data
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              To service providers or partners strictly as required to deliver
              our services (e.g., hosting, analytics, communications).
            </li>
            <li>
              To comply with legal or regulatory obligations, valid law
              enforcement requests, or court orders.
            </li>
            <li>With your consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Data Security
          </h2>
          <p className="text-gray-700 mb-2">
            We employ appropriate technical and organizational measures to
            protect personal data, including encryption, access controls, and
            secure storage.
          </p>
          <p className="text-gray-700">
            Data is stored only as long as necessary for the purpose it was
            collected or as required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Cookies & Tracking Technologies
          </h2>
          <p className="text-gray-700 mb-2">
            We use cookies and similar technologies to support functionality,
            analytics, and marketing.
          </p>
          <p className="text-gray-700">
            You can manage cookies through browser settings; disabling some
            cookies may affect website functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            7. Your Rights
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <span className="font-semibold">Access</span>: Request details of
              personal data we hold about you.
            </li>
            <li>
              <span className="font-semibold">Correction</span>: Request
              correction of inaccurate or incomplete data.
            </li>
            <li>
              <span className="font-semibold">Deletion</span>: Request deletion,
              subject to legal or contractual retention requirements.
            </li>
            <li>
              <span className="font-semibold">Objection</span>: Object to
              certain processing, including direct marketing.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            8. Third-Party Links
          </h2>
          <p className="text-gray-700">
            Our website may contain links to external sites; we are not
            responsible for their content or privacy practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            9. Children’s Data
          </h2>
          <p className="text-gray-700">
            FutureGPT is intended for adults and professionals. We do not
            knowingly collect personal data from children under 18.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            10. Changes to this Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. Updates will be
            posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            11. Contact
          </h2>
          <p className="text-gray-700">
            If you have questions or concerns about this policy or your data,
            contact us at{" "}
            <a
              href="mailto:contact@futuregpt.in"
              className="text-blue-600 hover:underline"
            >
              contact@futuregpt.in
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
