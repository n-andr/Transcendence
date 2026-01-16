
/*

just a random generated place holder! 

to be changed and styled later with custom components 

*/

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            Transcendence
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <a
            href="/"
            className="hover:text-gray-900 transition-colors"
          >
            Home
          </a>
          <a
            href="/game"
            className="hover:text-gray-900 transition-colors"
          >
            Play
          </a>
          <a
            href="/about"
            className="hover:text-gray-900 transition-colors"
          >
            About
          </a>

          {/* Auth placeholders */}
          <div className="flex items-center gap-3 ml-4">
            <a
              href="/login"
              className="hover:text-gray-900 transition-colors"
            >
              Login
            </a>
            <a
              href="/register"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 transition-colors"
            >
              Sign up
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
