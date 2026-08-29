const API_BASE_URL = "http://localhost:5000";

// =====================================================
// CENTRAL API HELPER
// =====================================================

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // ---------------------------------------------------
  // ATTACH JWT
  // ---------------------------------------------------

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    // -------------------------------------------------
    // READ RESPONSE
    // -------------------------------------------------

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    // -------------------------------------------------
    // INVALID / EXPIRED SESSION
    // -------------------------------------------------

    if (response.status === 401) {
      console.warn("Authentication session expired or is invalid.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...data,
        ok: false,
        status: 401,
        sessionExpired: true,
      };
    }

    // -------------------------------------------------
    // RETURN RESPONSE
    // -------------------------------------------------

    return {
      ...data,
      ok: response.ok,
      status: response.status,
    };

  } catch (error) {
    console.error("API request failed:", error);

    return {
      ok: false,
      status: 0,
      message: "Unable to connect to the server.",
      error: error.message,
    };
  }
};

export default api;