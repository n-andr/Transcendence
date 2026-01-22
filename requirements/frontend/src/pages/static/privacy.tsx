export default function Privacy() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            This application is a student project developed as part of the 42
            curriculum. We take user privacy seriously and aim to collect only
            the data necessary to provide the service.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Data We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Account information such as username and email address</li>
              <li>
                Authentication data (passwords are stored in a hashed form)
              </li>
              <li>
                User-generated content such as game statistics and chat messages
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Purpose of Data Collection
            </h2>
            <p className="text-gray-700 mb-3">
              The collected data is used exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Authenticate users</li>
              <li>Enable multiplayer and real-time features</li>
              <li>Display profiles and game-related information</li>
              <li>Ensure the proper functioning of the application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Data Storage
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All data is stored securely in our database and is not shared with
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Data Retention and Deletion
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Users may request the deletion of their account and associated
              data. Upon deletion, personal data is permanently removed from the
              system.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Contact
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions regarding data usage or deletion, please contact
              the project team via the repository linked in the About page.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
