import { Link } from "react-router-dom"
import { useCategories } from "../hooks/useCategories.ts"

const PageHead = () => (
  <div className="page-head">
    <h1 className="page-title">Browse categories</h1>
    <p className="page-dek">
      Start from a topic, then open the datasets filed under it.
    </p>
  </div>
)

export const CategoriesPage = () => {
  const { categories, isLoading, isError } = useCategories()

  if (isLoading) {
    return (
      <div className="container-custom pt-8 md:pt-10">
        <PageHead />
        <output className="block text-neutral-600">Loading categories</output>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-custom pt-8 md:pt-10">
        <PageHead />
        <div role="alert">
          <p className="font-display font-bold text-lg text-negative-700">
            Categories didn’t load
          </p>
          <p className="mt-1 text-neutral-700">
            Check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary mt-4"
            type="button"
          >
            Reload the page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom pt-8 md:pt-10">
      <PageHead />
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-ink">
        {categories.map((category) => (
          <li key={category.id} className="border-b border-rule-soft">
            <Link
              to={`/datasets?category_id=${category.id}`}
              className="group flex h-full flex-col py-5 px-3 -mx-3 hover:bg-paper-2 transition-colors"
            >
              <h2 className="text-xl text-ink group-hover:text-primary-600 transition-colors">
                {category.name}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                {category.description || "No description yet."}
              </p>
              <p className="meta mt-auto pt-4">
                {category.dataset_count}{" "}
                {category.dataset_count === 1 ? "dataset" : "datasets"}
                <span className="mx-2" aria-hidden="true">
                  /
                </span>
                {category.resource_count}{" "}
                {category.resource_count === 1 ? "file" : "files"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
