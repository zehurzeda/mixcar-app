import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { SEED_DEV_DB } from '$env/static/private';
import { seed } from '$lib/server/db/seed';
import { getAutenticatedUserByToken } from '$lib/server/auth';

if (dev) {
	if (SEED_DEV_DB === 'true') {
		await seed().catch((err) => {
			console.error(err);
		});
	}
}

export const handle = (async ({ event, resolve }) => {
	event.locals.user = await getAutenticatedUserByToken(event.cookies.get('AuthorizationToken'));

	if (!event.url.pathname.startsWith('/login')) {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
		if (event.url.pathname === '/') {
			throw redirect(303, '/dashboard');
		}
	} else if (event.locals.user) {
		throw redirect(303, '/');
	}

	const response = await resolve(event);

	return response;
}) satisfies Handle;
