import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import db from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
  const { name, email, password } = await request.json();

  const exists = await db.users.findOne({ email });
  if (exists) return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await db.users.insertOne({ name, email, password: hashed });

  return new Response(JSON.stringify({ success: true }), { status: 201 });
};
