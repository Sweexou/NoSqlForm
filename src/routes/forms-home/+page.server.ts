import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  const userId = locals.user.id;

  const forms = await db.questionnaires.find(
    { authorId: userId },
    { projection: { _id: 1, title: 1 } }
  ).toArray();

  return {
    user: locals.user,
    forms: forms.map(f => ({ id: f._id.toString(), title: f.title }))
  };
};
