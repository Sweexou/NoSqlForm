import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import db from '$lib/db';
import { JWT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies }) => {
  const token = cookies.get('token');
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log(decoded.id)
    // Only get forms for this user
    const forms = await db.questionnaires
      .find({ authorId: decoded.id.toString() })
      .project({ title: 1 })
      .toArray();

    return new Response(JSON.stringify(forms), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }
};