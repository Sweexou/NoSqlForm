import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import db from '$lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

// export const POST: RequestHandler = async ({ request }) => {
// 	try {
// 		const body = await request.json();

// 		// Basic validation (optional, expand as needed)
// 		if (!body.title || !body.questions || !Array.isArray(body.questions)) {
// 			return json({ error: 'Invalid form data' }, { status: 400 });
// 		}
// 		const collection = db.questionnaires;

// 		const result = await collection.insertOne(body);

// 		return json({ insertedId: result.insertedId }, { status: 201 });
// 	} catch (err) {
// 		console.error('Error saving form:', err);
// 		return json({ error: 'Failed to save form' }, { status: 500 });
// 	}
// };

export const POST: RequestHandler = async ({ request, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();

    const formToInsert = {
      ...body,
      authorId: decoded.id,  // ✅ inject user ID here
      createdAt: new Date()
    };

    const result = await db.questionnaires.insertOne(formToInsert);
    return json({ insertedId: result.insertedId }, { status: 201 });
  } catch (err) {
    return json({ error: 'Invalid token' }, { status: 401 });
  }
};