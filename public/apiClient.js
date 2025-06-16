function apiFetch(path, options = {}) {
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000/api"
      : `https://${window.location.hostname}/api`;
  const url = `${API_BASE_URL}${path}`;
  const fixedHeaders = {};
  const token = localStorage.getItem("token");
  if (token) {
    fixedHeaders.Authorization = `Bearer ${token}`;
  }
  options.headers = {
    ...options.headers,
    ...fixedHeaders,
    "Content-Type": "application/json",
  };

  return fetch(url, options);
}
