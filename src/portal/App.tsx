import axios from "axios"
import { BrowserRouter, Route, Routes } from "react-router"
import { SWRConfig } from "swr"
import { Layout } from "./components/Layout.tsx"
import { AboutPage } from "./routes/AboutPage.tsx"
import { CategoriesPage } from "./routes/CategoriesPage.tsx"
import { ContributePage } from "./routes/ContributePage.tsx"
import { DatasetDetailPage } from "./routes/DatasetDetailPage.tsx"
import { DatasetsPage } from "./routes/DatasetsPage.tsx"
import { HomePage } from "./routes/HomePage.tsx"
import { NotFoundPage } from "./routes/NotFoundPage.tsx"
import { ResourceDetailPage } from "./routes/ResourceDetailPage.tsx"
import { TermsOfServicePage } from "./routes/TermsOfServicePage.tsx"
import { WorkingWithDatasetsPage } from "./routes/WorkingWithDatasetsPage.tsx"

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5173/api/v1"
  : "/api/v1"

const fetcher = async <T,>(url: string): Promise<T> => {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`
  const response = await axios.get(fullUrl)

  if (!response.data.success) {
    throw new Error(response.data.error?.message || "API returned error")
  }

  return response.data
}

const App = () => {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: 5000,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/datasets/:id" element={<DatasetDetailPage />} />
            <Route
              path="/datasets/:datasetId/resources/:resourceId"
              element={<ResourceDetailPage />}
            />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contribute" element={<ContributePage />} />
            <Route
              path="/working-with-datasets"
              element={<WorkingWithDatasetsPage />}
            />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  )
}

export default App
