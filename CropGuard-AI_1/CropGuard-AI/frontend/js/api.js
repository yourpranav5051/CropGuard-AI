// Central place for the backend URL — change this one line when you deploy.
const API_BASE = "http://127.0.0.1:8000";

function saveToken(token) {
  localStorage.setItem("cropguard_token", token);
}
function getToken() {
  return localStorage.getItem("cropguard_token");
}
function clearToken() {
  localStorage.removeItem("cropguard_token");
}
function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

async function apiRequest(path, { method = "GET", body = null, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) headers["Authorization"] = `Bearer ${getToken()}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : null,
  });

  let data = null;
  try { data = await res.json(); } catch (_) { /* no body */ }

  if (!res.ok) {
    const message = (data && data.detail) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}
