const isLocalEnv = process.env.BACKEND_ENV === 'dev';
const port = isLocalEnv ? '3030' : '3000';
const host = isLocalEnv ? `localhost:${port}` : 'domain.com';
const useHTTPS = !isLocalEnv;
const appUrl = `${useHTTPS ? 'https://' : 'http://'}${host}`;

export default {
	appUrl,
	google: {
		callbackURL: '/api/auth/google/callback',
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	},
};
