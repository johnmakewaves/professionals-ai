import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agentId } = params;
    
    if (!agentId || isNaN(parseInt(agentId))) {
      return Response.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const conversations = await sql`
      SELECT id, title, created_at, updated_at
      FROM conversations
      WHERE user_id = ${session.user.id} AND agent_id = ${parseInt(agentId)}
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    if (conversations.length === 0) {
      return Response.json(
        { error: 'No conversation found' },
        { status: 404 }
      );
    }

    return Response.json(conversations[0]);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return Response.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}