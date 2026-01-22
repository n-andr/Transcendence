export default function About() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <section className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            About This Project
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A student-built web application developed as part of the{" "}
            <strong>ft_transcendence</strong> project at 42.
          </p>
        </header>

        {/* Content */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Project Goal
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The goal of this project is to design and implement a complete web
              application featuring real-time interaction, user management, and
              modern web technologies. The focus lies on building a coherent,
              reliable system rather than a polished commercial product.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Key Features
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>User accounts and authentication</li>
              <li>Multiplayer gameplay</li>
              <li>Real-time communication</li>
              <li>Persistent user data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900 mb-3">
              Technology Stack
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-medium text-gray-900">Frontend:</span>{" "}
                React / Next.js
              </li>
              <li>
                <span className="font-medium text-gray-900">Backend:</span>{" "}
                Node.js with a web framework
              </li>
              <li>
                <span className="font-medium text-gray-900">Database:</span>{" "}
                PostgreSQL
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  Real-time features:
                </span>{" "}
                WebSockets
              </li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              This project is intended as a learning experience and is not
              offered as a commercial service.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
