import { VITE_SPOTIFY_CLIENT_ID, VITE_SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { redirect, json } from '@sveltejs/kit';

export const GET = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	const cookieState = cookies.get('state');

	if (!cookieState || !state || cookieState !== state) {
		console.log('NO STATE OR DIFFERENT', state, cookieState);
	}
	const authKey = Buffer.from(VITE_SPOTIFY_CLIENT_ID + ':' + VITE_SPOTIFY_CLIENT_SECRET).toString(
		'base64'
	);

	const headers = new Headers();
	headers.append('Authorization', `Basic ${authKey}`);
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	headers.append('Accept', 'application/json');

	const spotifyURL = new URL('https://accounts.spotify.com/api/token');
	spotifyURL.searchParams.append('code', code as string);
	spotifyURL.searchParams.append('redirect_uri', 'http://localhost:5173/api/auth/callback/spotify');
	spotifyURL.searchParams.append('grant_type', 'authorization_code');

	console.log(spotifyURL.toString());

	const result = await fetch(url, {
		method: 'POST',
		headers

		// body: JSON.stringify({
		// 	code: code,
		// 	redirect_uri: 'http://localhost:5173/api/auth/callback/spotify',
		// 	grant_type: 'authorization_code'
		// })
	});

	console.log(result.status);
	console.log(await result.text());

	if (!result.ok) {
		throw redirect(300, '/?error=A problemo');
	}

	return json({
		code,
		state
	});

	throw redirect(300, '/');
};
