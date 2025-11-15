export interface Publisher {
  id: number;
  name: string;
  website_url: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface CategoryListItem extends Category {
  dataset_count: number;
}

export interface Dataset {
  id: number;
  name: string;
  description: string | null;
  publisher_id: number;
  category_id: number;
  tags: string | null;
  size_bytes: number;
  latest_version_date: string | null;
}

export interface DatasetListItem extends Dataset {
  publisher: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  resource_count: number;
}

export interface DatasetDetail extends Dataset {
  publisher: Publisher;
  category: Category;
  resources: Resource[];
}

export interface Resource {
  id: number;
  dataset_id: number;
  name: string;
  description: string | null;
  mime_type: string;
  size_bytes: number;
  download_url: string;
  source_url: string | null;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
  current_page: number;
  total_pages: number;
}

export interface Stats {
  total_datasets: number;
  total_resources: number;
  total_publishers: number;
  total_categories: number;
  total_size_bytes: number;
}

// Cloudflare Workers bindings
export type Bindings = {
  DB: D1Database;
};
