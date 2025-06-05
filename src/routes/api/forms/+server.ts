// src/routes/api/forms/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import db from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		// Basic validation (optional, expand as needed)
		if (!body.title || !body.questions || !Array.isArray(body.questions)) {
			return json({ error: 'Invalid form data' }, { status: 400 });
		}
		const collection = db.questionnaires;

		const result = await collection.insertOne(body);

		return json({ insertedId: result.insertedId }, { status: 201 });
	} catch (err) {
		console.error('Error saving form:', err);
		return json({ error: 'Failed to save form' }, { status: 500 });
	}
};
