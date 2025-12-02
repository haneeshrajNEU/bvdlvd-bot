import { SlashCommandBuilder, PermissionFlagsBits, TextChannel, EmbedBuilder, ChannelFlagsBitField } from 'discord.js';
import type { Command } from '../types/command';
import { CHANNEL_IDS, ROLE_IDS } from '../config/channels';

const FACTIONS = {
	CLARITY: '☀️ Order of Clarity',
	STATIC: '🌑 Child Of Static',
} as const;

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('autosort')
		.setDescription('Automatically sort all unassigned members 50/50 into factions')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async (interaction) => {
		await interaction.deferReply({ flags: ['Ephemeral'] });

		const guild = interaction.guild;
		if (!guild) {
			await interaction.editReply('This command can only be used in a server.');
			return;
		}

		const clarityRole = guild.roles.cache.get(ROLE_IDS.CLARITY_ROLE);
		const staticRole = guild.roles.cache.get(ROLE_IDS.STATIC_ROLE);

		if (!clarityRole || !staticRole) {
			await interaction.editReply('Could not find one or more faction roles. Please ensure role IDs are configured in config/channels.ts.');
			return;
		}

		const calmChannel = guild.channels.cache.get(CHANNEL_IDS.THE_CALM) as TextChannel | undefined;
		const immigrationChannel = guild.channels.cache.get(CHANNEL_IDS.PRESENCE_IMMIGRATION_SYSTEM) as TextChannel | undefined;

		if (!calmChannel || !immigrationChannel) {
			await interaction.editReply('Could not find one or more announcement channels. Please ensure channel IDs are configured in config/channels.ts.');
			return;
		}

		try {
			await guild.members.fetch({ withPresences: false });
		}
		catch (err) {
			console.warn('Could not fetch all members, continuing with available members:', err);
		}

		try {
			// Get all members who don't have either faction role (they're in "immigration")
			const unassignedMembers = guild.members.cache.filter(member =>
				!member.user.bot &&
				!member.roles.cache.has(clarityRole.id) &&
				!member.roles.cache.has(staticRole.id)
			);

			if (unassignedMembers.size === 0) {
				await interaction.editReply('No unassigned members found to sort.');
				return;
			}

			const membersArray = Array.from(unassignedMembers.values());
			const totalMembers = membersArray.length;
			const targetClarity = Math.floor(totalMembers / 2);
			
			// Create an array with faction assignments: true = Clarity, false = Static
			const factionAssignments = [
				...Array(targetClarity).fill(true),
				...Array(totalMembers - targetClarity).fill(false)
			];
			
			// Shuffle the faction assignments randomly
			for (let i = factionAssignments.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[factionAssignments[i], factionAssignments[j]] = [factionAssignments[j], factionAssignments[i]];
			}

			await interaction.editReply(`Starting auto-sort for ${membersArray.length} members...\n${targetClarity} → ☀️ Order of Clarity\n${totalMembers - targetClarity} → 🌑 Child Of Static`);

			const clarityChannel = guild.channels.cache.get(CHANNEL_IDS.CLARITY_CHANNEL) as TextChannel | undefined;

			const staticChannel = guild.channels.cache.get(CHANNEL_IDS.STATIC_CHANNEL) as TextChannel | undefined;

			// Assign each member to their randomly determined faction
			for (let i = 0; i < membersArray.length; i++) {
				const member = membersArray[i];
				const isClarity = factionAssignments[i];

			if (isClarity) {
				await member.roles.add(clarityRole);
				const embed = new EmbedBuilder()
					.setColor(0xFFD700)
					.setTitle('⚡ ASCENSION ⚡')
					.setDescription(`${member} has been elevated to the **${FACTIONS.CLARITY}**!`)
					.setFooter({ text: '*✦ - Courtesy of The Presence*' })
					.setTimestamp();

				// Post to both announcement channels
				await calmChannel.send({ embeds: [embed] });
				await immigrationChannel.send({ embeds: [embed] });

				if (clarityChannel) {
					await clarityChannel.send(`Welcome ${member} to the **Order of Clarity**! ✨`);
				}
				}
			else {
				await member.roles.add(staticRole);
				const embed = new EmbedBuilder()
					.setColor(0x4B0082)
					.setTitle('🌑 DISSENTION 🌑')
					.setDescription(`${member} has descended into the **${FACTIONS.STATIC}**!`)
					.setFooter({ text: '*✦ - Courtesy of The Presence*' })
					.setTimestamp();

				// Post to both announcement channels
				await calmChannel.send({ embeds: [embed] });
				await immigrationChannel.send({ embeds: [embed] });

				if (staticChannel) {
					await staticChannel.send(`Welcome ${member} to the **Children of Static**! 🔥`);
				}
				}

				await new Promise(resolve => setTimeout(resolve, 1000));
			}

			await interaction.followUp({
				content: `✅ Auto-sort complete! Assigned ${targetClarity} to Clarity and ${totalMembers - targetClarity} to Static in random order.`,
				flags: ['Ephemeral'],
			});
		}
		catch (err) {
			console.error('Error during auto-sort:', err);
			await interaction.followUp({
				content: 'There was an error during the auto-sort process. Make sure all members are loaded.',
				flags: ['Ephemeral'],
			});
		}
	},
};

export default command;