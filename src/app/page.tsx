import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-green-600">
        FASOSANTÉ
      </h1>

      <p className="mt-4 text-center text-gray-600">
        Trouvez vos médicaments rapidement partout au Burkina Faso.
      </p>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          href="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Se connecter
        </Link>

        <Link
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          S'inscrire
        </Link>

        <Link
          href="/dashboard/search"
          className="border border-green-600 text-green-600 px-6 py-3 rounded-lg"
        >
          Rechercher
        </Link>
      </div>
    </main>
  );
}