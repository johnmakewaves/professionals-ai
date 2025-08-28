import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const agents = await sql`
      SELECT id, name, title, specialty, description, avatar_url, background_color, prompt_instructions
      FROM ai_agents
      WHERE id = ${parseInt(id)}
    `;

    if (agents.length === 0) {
      return Response.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return Response.json(agents[0]);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return Response.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}