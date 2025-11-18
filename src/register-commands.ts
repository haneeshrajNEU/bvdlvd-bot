import { REST, Routes } from 'discord.js';
import { env } from './config/env';
import commands from './commands';

const rest = new REST({ version: '10' }).setToken(env.token);

async function main() {
	const body = commands.map(c => c.data.toJSON());
	if (env.guildId) {
		console.log('Deploying guild commands to', env.guildId);
		await rest.put(Routes.applicationGuildCommands(env.clientId, env.guildId), { body });
		console.log('Guild commands deployed');
	}
	else {
		console.log('Deploying global commands');
		await rest.put(Routes.applicationCommands(env.clientId), { body });
		console.log('Global commands deployed');
	}
}

main().catch(err => {
	console.error('Failed to deploy commands:', err);
	process.exit(1);
});
