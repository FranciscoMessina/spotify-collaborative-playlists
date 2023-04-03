import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const load = async (event) => {
	const form = await superValidate(event, schema);
	const session = await event.locals.auth.validate();

	if (session) {
		throw redirect(300, '/');
	}

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(await request.formData(), schema);

		// console.log('POST', form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					email
				}
			});

			console.log(user);

			const session = await auth.createSession(user.id);

			locals.auth.setSession(session);

			return { form };
		} catch (e) {
			console.log(e);
			return fail(400, { form });
		}
	}
};
