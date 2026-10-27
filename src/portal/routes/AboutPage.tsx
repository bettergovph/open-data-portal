import { Code, Code2, Database, FlaskConical, Newspaper, Search, Users } from "lucide-react"

const whatWeDo = [
  {
    icon: Database,
    title: "Curate Datasets",
    description:
      "We collect, organize, and maintain a comprehensive catalog of Philippine public datasets from government agencies, NGOs, and community contributors.",
  },
  {
    icon: Search,
    title: "Enable Discovery",
    description:
      "Our search and filtering tools make it easy to find relevant datasets across categories, publishers, and formats, saving you time and effort.",
  },
  {
    icon: Code,
    title: "Provide API Access",
    description:
      "Our RESTful API allows developers to programmatically access datasets, enabling the creation of data-driven applications and services.",
  },
]

const whoBenefits = [
  {
    icon: Users,
    title: "Citizens & Communities",
    description: "Access information to make informed decisions about your community, health, education, and more.",
  },
  {
    icon: FlaskConical,
    title: "Researchers & Academics",
    description:
      "Find reliable datasets for studies, papers, and analysis on Philippine society, economy, and governance.",
  },
  {
    icon: Newspaper,
    title: "Journalists & Media",
    description: "Access verified public data to support investigative reporting and fact-based journalism.",
  },
  {
    icon: Code2,
    title: "Developers & Curious minds",
    description: "Build applications, visualizations, and services using our API and freely available datasets.",
  },
]

export const AboutPage = () => {
  return (
    <div className="container-custom pt-8 md:pt-10 pb-8">
      <h1 className="page-title mb-8">About</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Open Data Portal</h2>
        <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
          <p className="text-neutral-700 mb-6">
            Open Data Portal is a community-run portal for exploring publicly available datasets.
          </p>
          <p className="text-neutral-700">
            We believe that open data is essential for transparency, accountability, and innovation. By making datasets
            easily discoverable and accessible, we enable researchers, journalists, developers, students, and citizens
            to make informed decisions, create innovative solutions, and hold institutions accountable.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">What We Do</h2>
        <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
          <div className="space-y-6">
            {whatWeDo.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-center space-x-5">
                <div className="flex-shrink-0 w-20 h-20 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
                  <p className="text-neutral-700">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Who Benefits?</h2>
        <div className="bg-white border border-neutral-200 rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whoBenefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start space-x-4 p-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">{title}</h3>
                  <p className="text-sm text-neutral-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
