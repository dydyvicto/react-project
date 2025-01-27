import ProductList from "./components/ProductList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <ProductList />
      <Link href="/add">
        <button className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow mt-6 hover:bg-indigo-700">
          Ajouter un produit
        </button>
      </Link>
    </main>
  );
}
