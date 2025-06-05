import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');
    if (token) {
        try {
            const user = jwt.verify(token, JWT_SECRET);
            event.locals.user = user;

        } catch {
            event.locals.user = null;
            event.cookies.delete('token'); // delete invalid
        }
    }

    return resolve(event);
};
