import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '$lib/db';

const SECRET = process.env.JWT_SECRET!;

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  const user = await db.users.findOne({ email });

  if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  const token = jwt.sign({ id: user._id, email }, SECRET, { expiresIn: '1h' });
  return new Response(JSON.stringify({ token }), { status: 200 });
};
