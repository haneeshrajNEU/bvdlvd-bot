import { Collection, Events, type Client } from 'discord.js';
import ready from './ready';
import interactionCreate from './interactionCreate';
import type { Command } from '../types/command';

export function registerEvents(client: Client, commands: Command[]): void {
	const map = new Collection<string, Command>();
	for (const c of commands) map.set(c.data.name, c);

	client.once(Events.ClientReady, () => ready(client));
	client.on(Events.InteractionCreate, interactionCreate(map));
}
