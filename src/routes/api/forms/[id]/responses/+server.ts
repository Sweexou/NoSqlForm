import { json } from '@sveltejs/kit';
import db from '$lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { ObjectId } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Verify ownership
    const form = await db.questionnaires.findOne({
      _id: new ObjectId(params.id),
      authorId: decoded.id
    });

    if (!form) {
      return json({ error: 'Form not found or access denied' }, { status: 403 });
    }

    // Get responses
    const responses = await db.responses
      .find({ formId: new ObjectId(params.id) })
      .sort({ submittedAt: -1 })
      .toArray();

    return json(responses);
  } catch (err) {
    console.error('Error fetching responses:', err);
    return json({ error: 'Server error' }, { status: 500 });
  }
};
