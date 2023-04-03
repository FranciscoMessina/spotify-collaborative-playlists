import lucia from 'lucia-auth';
import kysely from '@lucia-auth/adapter-kysely';
import { dev } from '$app/environment';
import { db } from './db/kysely';
import { sveltekit } from 'lucia-auth/middleware';

export const auth = lucia({
	adapter: kysely(db, 'better-sqlite3'),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformUserData(userData) {
		return {
			id: userData.id,
			email: userData.email,
			displayName: userData.display_name
		};
	}
});

export type Auth = typeof auth;
