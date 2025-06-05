import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '$lib/db';
import { JWT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { identifier, password } = await request.json();

  // Try to find by email or username
  const user = await db.users.findOne({
    $or: [{ email: identifier }, { name: identifier }]
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  const token = jwt.sign({ id: user._id,name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
    }
  });
};
