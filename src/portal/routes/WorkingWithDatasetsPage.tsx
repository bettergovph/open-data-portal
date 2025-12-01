import { Code, Database, FileCode, Info } from "lucide-react"

export const WorkingWithDatasetsPage = () => {
  return (
    <div className="container-custom pt-4 pb-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">
        Working with Datasets
      </h1>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-8 mb-6">
        <div className="flex items-start gap-3 mb-6">
          <Info className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">
              About File Formats
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Some datasets use specialized file formats like Parquet, which are
              optimized for data storage and analysis but may require conversion
              for use in common tools like Excel or data analysis software. This
              guide will help you work with these formats.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-8 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-neutral-900">
            Working with Parquet Files
          </h2>
        </div>

        <p className="text-neutral-700 mb-6 leading-relaxed">
          Parquet is a columnar storage format optimized for big data
          processing. It's commonly used for large datasets but isn't directly
          compatible with spreadsheet applications. Here's how to convert
          Parquet files to more accessible formats using DuckDB.
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Step 1: Install DuckDB
          </h3>
          <p className="text-neutral-700 mb-4">
            DuckDB is a fast, embeddable analytical database that can easily
            read and convert Parquet files. Visit{" "}
            <a
              href="https://duckdb.org/docs/installation/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              duckdb.org/docs/installation
            </a>{" "}
            for installation instructions for your operating system.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Step 2: Convert Parquet Files
          </h3>
          <p className="text-neutral-700 mb-4">
            Once DuckDB is installed, you can use the command-line interface
            (CLI) to convert Parquet files to various formats:
          </p>

          <div className="space-y-4">
            <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileCode className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-bold text-neutral-900">
                  Convert to CSV
                </h4>
              </div>
              <code className="block bg-primary-100 text-neutral-900 px-4 py-3 rounded text-sm font-mono overflow-x-auto">
                duckdb -c "COPY (SELECT * FROM 'input.parquet') TO 'output.csv'
                (HEADER, DELIMITER ',')"
              </code>
            </div>

            <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-bold text-neutral-900">
                  Convert to JSON
                </h4>
              </div>
              <code className="block bg-primary-100 text-neutral-900 px-4 py-3 rounded text-sm font-mono overflow-x-auto">
                duckdb -c "COPY (SELECT * FROM 'input.parquet') TO
                'output.json'"
              </code>
            </div>

            <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-purple-600" />
                <h4 className="text-lg font-bold text-neutral-900">
                  Convert to SQL
                </h4>
              </div>
              <div className="space-y-2">
                <code className="block bg-primary-100 text-neutral-900 px-4 py-3 rounded text-sm font-mono overflow-x-auto">
                  duckdb -c "CREATE TABLE my_table AS SELECT * FROM
                  'input.parquet'; EXPORT DATABASE 'output' (FORMAT SQL)"
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
