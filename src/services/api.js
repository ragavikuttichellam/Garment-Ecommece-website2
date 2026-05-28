const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
  localStorage.removeItem("garmentx_user");
}

async function request(path, options = {}) {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  // Build headers - use plain object for better compatibility
  const headers = { ...options.headers };

  // Only set Content-Type for JSON requests, not FormData
  if (!isFormData && options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Always add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    ...(options.body && { body: options.body }),
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthStorage();
    }

    const error = new Error(
      data?.message || response.statusText || "API request failed",
    );
    error.response = { status: response.status, data };
    throw error;
  }

  return { data, status: response.status };
}

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

const apiClient = {
  get: (path, config = {}) =>
    request(`${path}${buildQuery(config.params || {})}`),
  post: (path, body, config = {}) =>
    request(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: config.headers,
    }),
  put: (path, body, config = {}) =>
    request(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: config.headers,
    }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export const productAPI = {
  getProducts: (page = 1, keyword = "") => {
    return apiClient.get("/products", {
      params: {
        pageNumber: page,
        keyword,
      },
    });
  },

  getProductById: (id) => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: (formData) => {
    return apiClient.post("/products", formData);
  },

  updateProduct: (id, formData) => {
    return apiClient.put(`/products/${id}`, formData);
  },

  deleteProduct: (id) => {
    return apiClient.delete(`/products/${id}`);
  },
};

export const authAPI = {
  register: (userData) => {
    return apiClient.post("/auth/register", userData);
  },

  login: (credentials) => {
    return apiClient.post("/auth/login", credentials);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
};

export const cartAPI = {
  getCart: () => {
    return apiClient.get("/cart");
  },

  addToCart: (productId, quantity, size, color) => {
    return apiClient.post("/cart", {
      productId,
      quantity,
      size,
      color,
    });
  },

  updateCartItem: (productId, quantity) => {
    return apiClient.put("/cart", {
      productId,
      quantity,
    });
  },

  removeFromCart: (productId) => {
    return apiClient.delete(`/cart/${productId}`);
  },

  clearCart: () => {
    return apiClient.delete("/cart");
  },
};

export const orderAPI = {
  createOrder: (orderData) => {
    return apiClient.post("/orders", orderData);
  },

  getOrders: () => {
    return apiClient.get("/orders");
  },

  getOrderById: (id) => {
    return apiClient.get(`/orders/${id}`);
  },
};

export default apiClient;
