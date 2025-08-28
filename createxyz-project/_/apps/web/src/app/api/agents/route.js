import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const agents = await sql`
      SELECT id, name, title, specialty, description, avatar_url, background_color
      FROM ai_agents
      ORDER BY name ASC
    `;

    return Response.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return Response.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}