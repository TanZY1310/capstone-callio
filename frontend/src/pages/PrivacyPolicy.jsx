import { Navbar, Footer } from './LandingPage';
import { useTheme } from '../hooks/useTheme';

function PrivacyPolicy() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Privacy Policy
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
              1. Introduction
            </h2>
            <p>
              Callio ("we", "us", "our") provides a customer relationship
              management platform for property agents and agencies in
              Malaysia. This Privacy Policy explains what information we
              collect, how we use it, and the choices you have.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account information</strong> — name, email address,
                and password when you register for a Callio account.
              </li>
              <li>
                <strong>Customer and lead data</strong> — information you
                enter or import about your own leads and customers, including
                contact details and notes.
              </li>
              <li>
                <strong>WhatsApp messages</strong> — when you connect a
                WhatsApp account, we store message history and metadata
                needed to display conversations inside Callio.
              </li>
              <li>
                <strong>Call recordings and transcripts</strong> — where call
                analysis is enabled, we process and store audio and derived
                transcripts.
              </li>
              <li>
                <strong>Google Sheets data</strong> — when you connect Google
                Sheets, we read and write the customer data you choose to
                sync.
              </li>
              <li>
                <strong>Usage data</strong> — log and analytics data such as
                pages visited and actions taken within the app.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              3. How We Use Your Information
            </h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, operate, and maintain the Callio platform</li>
              <li>
                Sync your data between Callio, WhatsApp, and Google Sheets as
                you configure
              </li>
              <li>Generate call transcripts and pipeline analytics</li>
              <li>
                Communicate with you about your account or support requests
              </li>
              <li>Improve and secure our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              4. Third-Party Services
            </h2>
            <p>
              We integrate with third-party services including WhatsApp and
              Google Sheets. Data shared with these integrations is subject
              to your configuration and the respective third party's own
              privacy practices. We only access what is necessary to provide
              the connected features you enable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              5. Data Retention & Security
            </h2>
            <p>
              We retain your data for as long as your account is active or as
              needed to provide the service. We apply reasonable technical
              and organisational measures to protect your data, but no
              method of transmission or storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              6. Your Rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal data by contacting us. Agency administrators are
              responsible for the customer data they input into Callio on
              behalf of their own leads and clients.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-base-content mb-2">
              7. Contact Us
            </h2>
            <p>
              Questions about this Privacy Policy can be sent to{' '}
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

export default PrivacyPolicy;
