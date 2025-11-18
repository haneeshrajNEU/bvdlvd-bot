import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../types/command';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	execute: async (interaction) => {
		await interaction.reply('Pong!');
		await interaction.followUp('This is a follow-up message.');
	},
};

export default command;
