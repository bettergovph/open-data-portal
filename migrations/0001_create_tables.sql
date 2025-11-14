-- Migration 0001: Initial schema setup
-- Creates all tables, indexes, triggers, and FTS for the Open Data Portal API

-- Create publishers table
CREATE TABLE publishers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    website_url TEXT,
    created_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    last_mod_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

-- Create categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    last_mod_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

-- Create datasets table
CREATE TABLE datasets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    publisher_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    tags TEXT,
    size_bytes INTEGER NOT NULL,
    latest_version_date TEXT,
    created_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    last_mod_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Create resources table
CREATE TABLE resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    download_url TEXT NOT NULL,
    created_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    last_mod_ts INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE RESTRICT
);

-- Create indexes for publishers
CREATE INDEX idx_publishers_name ON publishers(name);

-- Create indexes for categories
CREATE INDEX idx_categories_name ON categories(name);

-- Create indexes for datasets
CREATE INDEX idx_datasets_publisher ON datasets(publisher_id);
CREATE INDEX idx_datasets_category ON datasets(category_id);
CREATE INDEX idx_datasets_name ON datasets(name);
CREATE INDEX idx_datasets_latest_version_date ON datasets(latest_version_date DESC);

-- Create indexes for resources
CREATE INDEX idx_resources_dataset ON resources(dataset_id);
CREATE INDEX idx_resources_mime_type ON resources(mime_type);
CREATE INDEX idx_resources_name ON resources(name);

-- Create triggers for automatic last_mod_ts updates
CREATE TRIGGER update_publishers_last_mod_ts
AFTER UPDATE ON publishers
FOR EACH ROW
BEGIN
    UPDATE publishers SET last_mod_ts = unixepoch() * 1000 WHERE id = NEW.id;
END;

CREATE TRIGGER update_categories_last_mod_ts
AFTER UPDATE ON categories
FOR EACH ROW
BEGIN
    UPDATE categories SET last_mod_ts = unixepoch() * 1000 WHERE id = NEW.id;
END;

CREATE TRIGGER update_datasets_last_mod_ts
AFTER UPDATE ON datasets
FOR EACH ROW
BEGIN
    UPDATE datasets SET last_mod_ts = unixepoch() * 1000 WHERE id = NEW.id;
END;

CREATE TRIGGER update_resources_last_mod_ts
AFTER UPDATE ON resources
FOR EACH ROW
BEGIN
    UPDATE resources SET last_mod_ts = unixepoch() * 1000 WHERE id = NEW.id;
END;

-- Create FTS5 virtual table for full-text search on datasets
CREATE VIRTUAL TABLE datasets_fts USING fts5(
    name,
    description,
    tags,
    content=datasets,
    content_rowid=id
);

-- Create triggers to keep FTS index synchronized
CREATE TRIGGER datasets_fts_insert AFTER INSERT ON datasets BEGIN
    INSERT INTO datasets_fts(rowid, name, description, tags)
    VALUES (new.id, new.name, new.description, new.tags);
END;

CREATE TRIGGER datasets_fts_delete AFTER DELETE ON datasets BEGIN
    DELETE FROM datasets_fts WHERE rowid = old.id;
END;

CREATE TRIGGER datasets_fts_update AFTER UPDATE ON datasets BEGIN
    UPDATE datasets_fts
    SET name = new.name,
        description = new.description,
        tags = new.tags
    WHERE rowid = new.id;
END;
