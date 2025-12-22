import {
  Code,
  Code2,
  Database,
  FlaskConical,
  Newspaper,
  Search,
  Users,
} from "lucide-react"

export const AboutPage = () => {
  return (
    <div className="container-custom pt-4 pb-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">About</h1>

      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-white border border-neutral-200 rounded-lg p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Open Data Portal
          </h2>
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Open Data Portal is a community-run portal for exploring publicly
            available datasets.
          </p>
          <p className="text-lg text-neutral-700 leading-relaxed">
            We believe that open data is essential for transparency,
            accountability, and innovation. By making datasets easily
            discoverable and accessible, we enable researchers, journalists,
            developers, students, and citizens to make informed decisions,
            create innovative solutions, and hold institutions accountable.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">
              Curate Datasets
            </h3>
            <p className="text-neutral-700">
              We collect, organize, and maintain a comprehensive catalog of
              Philippine public datasets from government agencies, NGOs, and
              community contributors.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">
              Enable Discovery
            </h3>
            <p className="text-neutral-700">
              Our search and filtering tools make it easy to find relevant
              datasets across categories, publishers, and formats, saving you
              time and effort.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">
              Provide API Access
            </h3>
            <p className="text-neutral-700">
              Our RESTful API allows developers to programmatically access
              datasets, enabling the creation of data-driven applications and
              services.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-lg p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center pb-8">
          Who Benefits?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <Users className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-xl text-neutral-900 mb-1">
                Citizens & Communities
              </h4>
              <p className="text-neutral-700">
                Access information to make informed decisions about your
                community, health, education, and more.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FlaskConical className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-xl text-neutral-900 mb-1">
                Researchers & Academics
              </h4>
              <p className="text-neutral-700">
                Find reliable datasets for studies, papers, and analysis on
                Philippine society, economy, and governance.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Newspaper className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-xl text-neutral-900 mb-1">
                Journalists & Media
              </h4>
              <p className="text-neutral-700">
                Access verified public data to support investigative reporting
                and fact-based journalism.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Code2 className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-xl text-neutral-900 mb-1">
                Developers & Curious minds
              </h4>
              <p className="text-neutral-700">
                Build applications, visualizations, and services using our API
                and freely available datasets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
