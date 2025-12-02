import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { env } from './config/env';
import commands from './commands';
import { registerEvents } from './events';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
	partials: [Partials.Channel],
});

registerEvents(client, commands);

// client.once('clientReady', () => {
// 	client.user?.setActivity("");
// });

client.on('error', (err) => {
	console.error('Client error:', err);
});

client.login(env.token).catch((err) => {
	console.error('Login failed:', err);
	process.exit(1);
});
