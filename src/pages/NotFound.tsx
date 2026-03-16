import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Page not found.</p>
      <Link to="/" className="mt-4 text-blue-600 underline">
        Back to Dashboard
      </Link>
    </div>
  )
}
