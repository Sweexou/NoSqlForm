import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import db from '$lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ params, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!params.id) {
      return json({ error: 'Form ID is required' }, { status: 400 });
    }
    const collection = db.questionnaires;
    const form = await collection.findOne({
      _id: new ObjectId(params.id),
      authorId: decoded.id
    });
    if (!form) {
      return json({ error: 'Form not found' }, { status: 404 });
    }
    return json(form);
  } catch (err) {
    console.error('Error fetching form:', err);
    if (err.name === 'JsonWebTokenError') {
      return json({ error: 'Invalid token' }, { status: 401 });
    }
    return json({ error: 'Failed to fetch form' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();

    if (!params.id) {
      return json({ error: 'Form ID is required' }, { status: 400 });
    }

    // Basic validation
    if (!body.title || !body.questions || !Array.isArray(body.questions)) {
      return json({ error: 'Invalid form data' }, { status: 400 });
    }

    // Remove immutable fields from the update
    const { _id, authorId, createdAt, ...updateData } = body;

    const collection = db.questionnaires;

    const result = await collection.updateOne(
      {
        _id: new ObjectId(params.id),
        authorId: decoded.id
      },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return json({ error: 'Form not found or unauthorized' }, { status: 404 });
    }

    return json({ message: 'Form updated successfully' });
  } catch (err) {
    console.error('Error updating form:', err);
    if (err.name === 'JsonWebTokenError') {
      return json({ error: 'Invalid token' }, { status: 401 });
    }
    return json({ error: 'Failed to update form' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (!params.id) {
      return json({ error: 'Form ID is required' }, { status: 400 });
    }

    const collection = db.questionnaires;

    const result = await collection.deleteOne({
      _id: new ObjectId(params.id),
      authorId: decoded.id
    });

    if (result.deletedCount === 0) {
      return json({ error: 'Form not found or unauthorized' }, { status: 404 });
    }

    return json({ message: 'Form deleted successfully' });
  } catch (err) {
    console.error('Error deleting form:', err);
    if (err.name === 'JsonWebTokenError') {
      return json({ error: 'Invalid token' }, { status: 401 });
    }
    return json({ error: 'Failed to delete form' }, { status: 500 });
  }
};
