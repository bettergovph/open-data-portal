import { SearchX } from "lucide-react"
import { Link } from "react-router-dom"

export const NotFoundPage = () => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <SearchX className="w-32 h-32 mx-auto text-neutral-300" />
        </div>

        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-neutral-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-block bg-primary-600 text-white hover:bg-primary-700 font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            Go Home
          </Link>
          <Link
            to="/datasets"
            className="inline-block bg-white text-primary-600 hover:bg-neutral-50 border-2 border-primary-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Browse Datasets
          </Link>
        </div>
      </div>
    </div>
  )
}
