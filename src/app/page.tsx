export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Peyaraful Crowdfunding</h1>
      <p className="text-lg text-gray-600 mb-8">
        Fund creative projects, support creators, and make a difference.
      </p>
      <div className="flex gap-4">
        <a
          href="/explore"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Explore Campaigns
        </a>
        <a
          href="/login"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Login
        </a>
      </div>
    </div>
  );
}
