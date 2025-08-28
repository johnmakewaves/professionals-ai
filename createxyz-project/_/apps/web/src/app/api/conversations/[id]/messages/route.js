import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { error: 'Invalid conversation ID' },
        { status: 400 }
      );
    }

    // Verify the conversation belongs to the user
    const conversations = await sql`
      SELECT id
      FROM conversations
      WHERE id = ${parseInt(id)} AND user_id = ${session.user.id}
    `;

    if (conversations.length === 0) {
      return Response.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const messages = await sql`
      SELECT role, content, created_at
      FROM messages
      WHERE conversation_id = ${parseInt(id)}
      ORDER BY created_at ASC
    `;

    return Response.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}