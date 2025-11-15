// Client-side utility functions

// Format bytes to human-readable size
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Get human-readable MIME type display
function getMimeTypeDisplay(mimeType) {
  const map = {
    'application/zip': 'ZIP',
    'application/json': 'JSON',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel (XLSX)',
    'application/vnd.apache.parquet': 'Parquet',
    'application/pdf': 'PDF',
    'text/csv': 'CSV',
  };
  return map[mimeType] || mimeType.split('/').pop().toUpperCase();
}

// Format date to human-readable format
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
