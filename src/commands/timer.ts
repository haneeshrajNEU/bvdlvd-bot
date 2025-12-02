import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types/command';

const EVENT_TIME = new Date('2025-12-04T20:00:00Z'); // Thursday 8PM UK time

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('timer')
		.setDescription('Check how much time is left until The Fracture'),

	execute: async (interaction) => {
		await interaction.deferReply();

		const now = new Date().getTime();
		const eventTimeMs = EVENT_TIME.getTime();

		if (now >= eventTimeMs) {
			const embed = new EmbedBuilder()
				.setColor(0x4B0082)
				.setTitle('🌑 The Fracture 🌑')
				.setDescription('The event has begun.')
				.setFooter({ text: 'The Presence Observes' })
				.setTimestamp();

			await interaction.editReply({ embeds: [embed] });
			return;
		}

		const timeLeftMs = eventTimeMs - now;

		const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
		const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

		const embed = new EmbedBuilder()
			.setColor(0x9C27B0)
			.setTitle('🌑 The Fracture 🌑')
			.setDescription('Time remaining until The Fracture begins')
			.addFields(
				{ name: 'Days', value: `${days}`, inline: true },
				{ name: 'Hours', value: `${hours}`, inline: true },
				{ name: 'Minutes', value: `${minutes}`, inline: true },
				{ name: 'Seconds', value: `${seconds}`, inline: true }
			)
			.setFooter({ text: 'The Presence Observes' })
			.setTimestamp();

		await interaction.editReply({ embeds: [embed] });
	},
};

export default command;
