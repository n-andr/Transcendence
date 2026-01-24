export default function Terms() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            By using this application, you agree to the following terms.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Service Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              This platform is a student-built web application created for
              educational purposes. The service is provided “as is”, without any
              guarantees regarding availability, performance, or reliability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              User Responsibilities
            </h2>
            <p className="text-gray-700 mb-3">
              By using this application, users agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Provide accurate and truthful account information</li>
              <li>Behave respectfully toward other users</li>
              <li>
                Refrain from abusive, illegal, or otherwise disruptive behavior
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Prohibited Behavior
            </h2>
            <p className="text-gray-700 mb-3">
              The following actions are not permitted:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Harassment, hate speech, or discriminatory behavior</li>
              <li>Exploitation of bugs or vulnerabilities</li>
              <li>
                Attempts to disrupt, overload, or otherwise interfere with the
                service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Account Moderation
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or delete user accounts that
              violate these terms or negatively impact other users or the
              platform.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The project team is not responsible for data loss, service
              interruptions, or any damages resulting from the use of this
              application.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
