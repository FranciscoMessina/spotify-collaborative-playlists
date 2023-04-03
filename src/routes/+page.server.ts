export const load = async ({ locals, cookies }) => {
	const auth = await locals.auth.validateUser();

	const spotifyAuthUrl = new URL(`https://accounts.spotify.com/authorize?`);

	const state = crypto.randomUUID();

	spotifyAuthUrl.searchParams.append('response_type', 'code');
	spotifyAuthUrl.searchParams.append('client_id', import.meta.env.VITE_SPOTIFY_CLIENT_ID);
	spotifyAuthUrl.searchParams.append(
		'scope',
		'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-email user-read-private'
	);
	spotifyAuthUrl.searchParams.append(
		'redirect_uri',
		'http://localhost:5173/api/auth/callback/spotify'
	);
	spotifyAuthUrl.searchParams.append('state', state);

	cookies.set('state', state);

	console.log(auth);
	return { auth, spotifyAuthUrl: spotifyAuthUrl.toString() };
};
