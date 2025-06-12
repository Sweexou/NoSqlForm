import { json } from '@sveltejs/kit';
import db from '$lib/db';
import { ObjectId } from 'mongodb';

export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    
    const response = {
      formId: new ObjectId(body.formId),
      answers: body.answers,
      submittedAt: new Date()
    };

    const result = await db.responses.insertOne(response);
    return json({ success: true, responseId: result.insertedId });
    
  } catch (err) {
    console.error('Error saving response:', err);
    return json({ error: 'Failed to save response' }, { status: 500 });
  }
};
