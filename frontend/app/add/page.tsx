import AddProductForm from "../components/AddProductForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajout d'un produit</h1>
        <AddProductForm />
      </div>
    </main>
  );
}
