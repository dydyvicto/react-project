"use client";

import { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../services/api";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data } = await fetchProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des Produits</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
          >
            <div>
              <p className="font-medium text-gray-800">{product.name}</p>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-sm text-gray-600">{product.price} €</p>
            </div>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-600 text-white py-1 px-3 rounded-md shadow hover:bg-red-700"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
