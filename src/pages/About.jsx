export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">About Us</h1>
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            This is a modern React application built with the latest tools and frameworks.
          </p>
          <p>
            We use Vite for ultra-fast development, React Router for navigation, and Tailwind CSS for styling.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Tech Stack</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> React 18+
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> React Router
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> Vite
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
