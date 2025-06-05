import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  // Clear the JWT cookie
  return new Response(null, {
    status: 303,
    headers: {
      'Set-Cookie': 'token=; Path=/; Max-Age=0; HttpOnly',
      'Location': '/login' // ✅ Redirect after logout
    }
  });
};
