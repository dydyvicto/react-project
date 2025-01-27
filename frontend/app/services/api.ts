import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const fetchProducts = () => api.get("/products");
export const addProduct = (product: { name: string; category: string; price: number }) =>
  api.post("/products", product);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);
export const searchProducts = (query: string) => api.get(`/products/search?${query}`);

export default api;
