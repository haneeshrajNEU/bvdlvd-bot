import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types/command';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	execute: async (interaction) => {
		await interaction.reply({
			content: '🏓 Pong!',
			flags: ['Ephemeral'],
		});
	},
};

export default command;
