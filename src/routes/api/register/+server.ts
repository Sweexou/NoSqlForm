import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '$lib/db';
import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { name, email, password } = await request.json();

  const existing = await db.users.findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = await db.users.insertOne({ name, email, password: hashed });

  const token = jwt.sign({ id: result.insertedId.toString(), name, email }, JWT_SECRET, { expiresIn: '1h' });

  return new Response(JSON.stringify({ success: true }), {
    status: 201,
    headers: {
      'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
    }
  });
};
