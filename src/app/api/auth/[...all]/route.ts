// better-auth is disabled — project uses custom JWT auth on Express backend.
// This route exists only to prevent Turbopack from crashing on unmatched /api/auth/* requests.

export async function GET() {
  return Response.json({ message: "better-auth is disabled. Use /api/auth on the Express server." }, { status: 404 });
}

export async function POST() {
  return Response.json({ message: "better-auth is disabled. Use /api/auth on the Express server." }, { status: 404 });
}
