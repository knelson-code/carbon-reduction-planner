export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700">
              Effective Date: January 10, 2025
            </p>
            <p className="text-gray-700 mt-2">
              This Privacy Policy describes how New Day Climate ("we," "us," or "our"), a doing business name of New Day International Consulting, collects, uses, and protects information in connection with the CO₂ Reduction Planner tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data We Collect in the Application</h2>
            <p className="text-gray-700 mb-2">When you use the CO₂ Reduction Planner, we collect:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Username:</strong> A username you choose (no email required)</li>
              <li><strong>Password:</strong> Securely hashed and stored</li>
              <li><strong>Organization Data:</strong> Names and details of organizations you create (can be anonymous)</li>
              <li><strong>Emission Data:</strong> CO₂ emission figures and reduction tactics you input</li>
            </ul>
            <p className="text-gray-700 mt-3">
              <strong>Important:</strong> We do NOT collect email addresses within the application itself. You can choose completely anonymous usernames and organization names.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Marketing Communications (Separate System)</h2>
            <p className="text-gray-700 mb-2">
              If you request access through our website form, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Email address</li>
              <li>Company name (optional)</li>
              <li>Industry information (optional)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              This information is stored separately from your application data and is used only for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Sending you access credentials</li>
              <li>Occasional product updates and climate-related insights</li>
              <li>You may unsubscribe at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To provide and maintain the CO₂ Reduction Planner service</li>
              <li>To authenticate your access</li>
              <li>To store your organization and emission data</li>
              <li>To provide support when you contact us</li>
              <li>To improve the tool based on usage patterns (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
            <p className="text-gray-700 mb-2">
              <strong>We do NOT sell, trade, or share your data with third parties.</strong>
            </p>
            <p className="text-gray-700">
              Your application data (usernames, organizations, emission figures) remains private and is never shared externally.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Passwords are hashed using bcrypt encryption</li>
              <li>Data is stored in secure, encrypted databases</li>
              <li>HTTPS encryption for all connections</li>
              <li>Regular security updates and monitoring</li>
              <li>Automated backups to prevent data loss</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="text-gray-700 mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Deletion:</strong> Request complete deletion of your account and data</li>
              <li><strong>Correction:</strong> Update or modify your information</li>
              <li><strong>Portability:</strong> Export your data in a common format</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, contact: <a href="mailto:keith.nelson@newdayinternationalconsulting.com" className="text-orange-500 hover:text-orange-600 font-semibold">keith.nelson@newdayinternationalconsulting.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
            <p className="text-gray-700">
              We retain your data for as long as your account is active. If you request deletion, we will remove all your data within 30 days, except where we are required by law to retain certain information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">International Users (GDPR Compliance)</h2>
            <p className="text-gray-700">
              This tool complies with EU General Data Protection Regulation (GDPR) requirements. Your data is processed lawfully, fairly, and transparently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice in the application or via email (if we have your email from the access request form).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-700">
              For questions about this Privacy Policy or your data:
            </p>
            <p className="text-gray-700 mt-2">
              <strong>New Day Climate</strong><br />
              (A doing business name of New Day International Consulting)
            </p>
            <p className="text-gray-700 mt-2">
              Email: <a href="mailto:keith.nelson@newdayinternationalconsulting.com" className="text-orange-500 hover:text-orange-600 font-semibold">keith.nelson@newdayinternationalconsulting.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
