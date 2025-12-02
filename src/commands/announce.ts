import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';
import type { Command } from '../types/command';

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Create a custom announcement with an embed')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel to post the announcement to')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('title')
				.setDescription('Title of the announcement')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription('Main message content')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('color')
				.setDescription('Hex color code (e.g., FFD700 for gold, 4B0082 for purple)')
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('footer')
				.setDescription('Footer text')
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('image_url')
				.setDescription('URL for embed image')
				.setRequired(false)
		),

	execute: async (interaction) => {
		await interaction.deferReply({ flags: ['Ephemeral'] });

		const channel = interaction.options.getChannel('channel', true) as TextChannel;
		const title = interaction.options.getString('title', true);
		const description = interaction.options.getString('description', true);
		const colorInput = interaction.options.getString('color') || '9C27B0';
		const footer = interaction.options.getString('footer') || 'S.C.A.M - Signal Classification & Assignment Mechanism';
		const imageUrl = interaction.options.getString('image_url');

		// Validate channel is text-based
		if (!channel.isTextBased()) {
			await interaction.editReply('That channel is not a text channel.');
			return;
		}

		try {
			// Parse hex color
			const colorValue = parseInt(colorInput.replace('#', ''), 16) || 0x9C27B0;

			const embed = new EmbedBuilder()
				.setColor(colorValue)
				.setTitle(title)
				.setDescription(description)
				.setFooter({ text: footer })
				.setTimestamp();

			// Add image if provided
			if (imageUrl) {
				embed.setImage(imageUrl);
			}

			await channel.send({ embeds: [embed] });

			await interaction.editReply(`✅ Announcement posted to ${channel}!`);
		}
		catch (err) {
			console.error('Error posting announcement:', err);
			await interaction.editReply('Failed to post announcement. Please check the channel and inputs.');
		}
	},
};

export default command;
