import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '$lib/db';
import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  const user = await db.users.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

  const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '1h' });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
    }
  });
};
