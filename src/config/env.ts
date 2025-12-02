import 'dotenv/config';

function required(name: string): string {
	const v = process.env[name];
	if (!v) throw new Error(`Missing required env var: ${name}`);
	return v;
}

export const env = {
	token: required('DISCORD_TOKEN'),
	clientId: required('CLIENT_ID'),
	guildId: process.env.GUILD_ID,
	geminiApiKey: required('GEMINI_API_KEY'),
};

export default env;
