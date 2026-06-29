export function buildEndoUrl(absolutePath: string): string {
  if (!absolutePath) return "";
  
  // Replace backslashes with forward slashes for Windows paths
  const normalized = absolutePath.replace(/\\/g, '/');
  
  // Encode each segment of the path individually to handle spaces
  // and special characters safely, while preserving the slashes.
  const encodedPath = normalized
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
    
  // Ensure we always return exactly three slashes after the scheme
  // (endo:///) so Chromium treats the host as empty and doesn't
  // swallow the first path segment.
  if (encodedPath.startsWith('/')) {
    return `endo://${encodedPath}`;
  } else {
    // For Windows paths like C:/Users/...
    return `endo:///${encodedPath}`;
  }
}
