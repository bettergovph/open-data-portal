-- Migration 0003: Allow multiple authors per attribution entry
-- Converts each attribution entry's `author` string into an `authors` array

UPDATE datasets
SET attribution = (
  SELECT json_group_array(
    json_set(
      json_remove(value, '$.author'),
      '$.authors',
      json_array(json_extract(value, '$.author'))
    )
  )
  FROM json_each(datasets.attribution)
)
WHERE attribution IS NOT NULL AND json_valid(attribution);
