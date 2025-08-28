import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = await sql`
      SELECT preferred_name, created_at, updated_at
      FROM user_profiles
      WHERE user_id = ${session.user.id}
    `;

    const profile = profiles[0] || null;
    return Response.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return Response.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preferred_name } = body;

    if (!preferred_name || typeof preferred_name !== 'string') {
      return Response.json(
        { error: 'Preferred name is required' },
        { status: 400 }
      );
    }

    const trimmedName = preferred_name.trim();
    if (trimmedName.length === 0) {
      return Response.json(
        { error: 'Preferred name cannot be empty' },
        { status: 400 }
      );
    }

    // Upsert user profile
    await sql`
      INSERT INTO user_profiles (user_id, preferred_name, updated_at)
      VALUES (${session.user.id}, ${trimmedName}, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET 
        preferred_name = ${trimmedName},
        updated_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    return Response.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}