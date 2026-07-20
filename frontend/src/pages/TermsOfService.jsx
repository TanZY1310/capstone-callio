import { Navbar, Footer } from './LandingPage';
import { useTheme } from '../hooks/useTheme';

function TermsOfService() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-base-content/40 mb-10">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="space-y-8 text-base-content/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or using Callio, you agree to these
              Terms of Service. If you do not agree, do not use the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              2. The Service
            </h2>
            <p>
              Callio is a CRM platform for property agents and agencies,
              providing lead management, WhatsApp and Google Sheets
              integrations, call analysis, and pipeline analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              3. Accounts
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You are responsible for maintaining the confidentiality of
                your login credentials.
              </li>
              <li>
                You are responsible for all activity that occurs under your
                account.
              </li>
              <li>
                You must provide accurate information when registering for
                an account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Use Callio to store or transmit unlawful, harassing, or
                fraudulent content
              </li>
              <li>
                Attempt to gain unauthorised access to other accounts or our
                systems
              </li>
              <li>
                Use the WhatsApp or Google Sheets integrations in a way that
                violates those platforms' own terms of use
              </li>
              <li>
                Reverse engineer or resell the Callio platform without
                permission
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              5. Customer Data
            </h2>
            <p>
              You retain ownership of the lead and customer data you input
              into Callio. You are responsible for ensuring you have the
              right to store and process that data, including any consents
              required from your own customers under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              6. Availability
            </h2>
            <p>
              We aim to keep Callio available and reliable, but we do not
              guarantee uninterrupted access. Features depending on
              third-party integrations (WhatsApp, Google Sheets) may be
              affected by outages outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              7. Limitation of Liability
            </h2>
            <p>
              Callio is provided "as is". To the extent permitted by law, we
              are not liable for indirect, incidental, or consequential
              damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              8. Termination
            </h2>
            <p>
              We may suspend or terminate accounts that violate these Terms.
              You may stop using Callio and request account deletion at any
              time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              9. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of
              Callio after changes take effect constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              10. Contact Us
            </h2>
            <p>
              Questions about these Terms can be sent to{' '}
              <a href="mailto:jane@gmail.com" className="text-primary">
                jane@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TermsOfService;
