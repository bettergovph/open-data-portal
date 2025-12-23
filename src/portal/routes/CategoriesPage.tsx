import { AlertCircle, Database, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { useCategories } from "../hooks/useCategories.ts"

export const CategoriesPage = () => {
  const { categories, isLoading, isError } = useCategories()

  if (isLoading) {
    return (
      <div className="container-custom pt-4 pb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Browse Categories
        </h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-custom pt-4 pb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Browse Categories
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-800 font-medium">Failed to load categories</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
            type={"button"}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom pt-4 pb-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Browse Categories
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/datasets?category_id=${category.id}`}
            className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm flex flex-col hover:border-primary-300 hover:shadow-md transition-all"
          >
            <h3 className="text-xl font-bold text-neutral-900 mb-3">
              {category.name}
            </h3>
            <div className="flex-grow mb-4">
              {category.description ? (
                <p className="text-neutral-700 leading-relaxed">
                  {category.description}
                </p>
              ) : (
                <p className="text-neutral-500 italic">
                  No description available
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4 text-base font-semibold text-neutral-700 mt-auto">
              <div className="flex items-center space-x-1.5">
                <Database className="w-5 h-5 text-primary-600" />
                <span>
                  {category.dataset_count} dataset
                  {category.dataset_count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>
                  {category.resource_count} resource
                  {category.resource_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
