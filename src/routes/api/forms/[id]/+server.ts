// src/routes/api/forms/[id]/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import db from '$lib/db';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { ObjectId } from 'mongodb';

export const GET: RequestHandler = async ({ params }) => {
  try {
    if (!params.id) {
      return json({ error: 'Form ID is required' }, { status: 400 });
    }

    const form = await db.questionnaires.findOne({ 
      _id: new ObjectId(params.id) 
    });

    return form ? json(form) : json({ error: 'Form not found' }, { status: 404 });
    
  } catch (err) {
    console.error('GET Error:', err);
    return json({ error: 'Failed to fetch form' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const body = await request.json();

    // Validation renforcée
    const forbiddenFields = ['_id', 'authorId', 'createdAt'];
    if (forbiddenFields.some(field => field in body)) {
      return json({ error: 'Champs immuables détectés' }, { status: 400 });
    }

    const updateResult = await db.questionnaires.updateOne(
      { 
        _id: new ObjectId(params.id),
        authorId: decoded.id 
      },
      { 
        $set: {
          ...body,
          updatedAt: new Date()
        } 
      }
    );

    if (updateResult.matchedCount === 0) {
      return json({ error: 'Formulaire non trouvé ou non autorisé' }, { status: 404 });
    }

    return json({ message: 'Formulaire mis à jour avec succès' });

  } catch (err) {
    console.error('PUT Error:', err);
    return json({ error: 'Échec de la mise à jour' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, cookies }) => {
  const token = cookies.get('token');
  if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    const deleteResult = await db.questionnaires.deleteOne({
      _id: new ObjectId(params.id),
      authorId: decoded.id
    });

    if (deleteResult.deletedCount === 0) {
      return json({ error: 'Formulaire non trouvé ou non autorisé' }, { status: 404 });
    }

    return json({ message: 'Formulaire supprimé avec succès' });

  } catch (err) {
    console.error('DELETE Error:', err);
    return json({ error: 'Échec de la suppression' }, { status: 500 });
  }
};
