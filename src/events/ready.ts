import type { Client } from 'discord.js';

export default function ready(client: Client): void {
	console.log(`Ready! Logged in as ${client.user?.tag}`);
}
