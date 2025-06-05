import type { RequestHandler } from './$types';
import jwt from 'jsonwebtoken';
import db from '$lib/db';
import { JWT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
  const auth = request.headers.get('authorization');
  const token = auth?.split(' ')[1];

  if (!token) {
    throw redirect(302, '/login');
    return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
  }

  const forms = await db.questionnaires.find().project({ title: 1 }).toArray();
  return new Response(JSON.stringify(forms), { status: 200 });
};
