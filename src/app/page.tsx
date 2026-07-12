export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
      <div className="bg-white rounded-3xl shadow-lg border border-peyara-accent p-12 text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-peyara-dark">
          Peyaraful Crowdfunding
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Fund creative projects, support creators, and make a difference.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/explore"
            className="px-6 py-3 bg-peyara-primary text-peyara-dark rounded-lg hover:bg-peyara-dark hover:text-white transition font-semibold"
          >
            Explore Campaigns
          </a>
          <a
            href="/login"
            className="px-6 py-3 border border-peyara-secondary text-peyara-secondary rounded-lg hover:bg-peyara-secondary hover:text-white transition font-semibold"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
