export default function SupportPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Support</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-4">General Support</h2>
          <p className="text-gray-700 mb-4">
            Have questions about using the CO₂ Reduction Planner? Need help with features?
          </p>
          <p className="text-gray-700">
            Contact us: <a href="mailto:keith.nelson@newdayinternationalconsulting.com" className="text-orange-500 hover:text-orange-600 font-semibold">keith.nelson@newdayinternationalconsulting.com</a>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
          <p className="text-gray-700 mb-4">
            Your privacy is important to us. This tool uses username-only authentication - no email required in the app.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Your data is stored securely</li>
            <li>We never sell or share your information</li>
            <li>Organization names can be anything you choose (e.g., "Project X")</li>
            <li>Complete data deletion available upon request</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
