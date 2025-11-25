-- Migration: Add attribution and license fields
-- This migration adds support for crediting original authors and license information

-- Add attribution column (JSON array of author objects)
ALTER TABLE datasets ADD COLUMN attribution TEXT NULL;

-- Add license column (optional license identifier or description)
ALTER TABLE datasets ADD COLUMN license TEXT NULL;

-- Add license_url column (optional URL linking to full license text)
ALTER TABLE datasets ADD COLUMN license_url TEXT NULL;

-- Note: We don't need to update FTS5 table as license is not searchable
-- Attribution is stored as JSON and is not included in full-text search
-- Attribution-level license_url will be stored within the JSON attribution field
-- The existing FTS5 table and triggers remain unchanged
