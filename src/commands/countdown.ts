import { SlashCommandBuilder, PermissionFlagsBits, TextChannel, EmbedBuilder } from 'discord.js';
import type { Command } from '../types/command';

const EVENT_TIME = new Date('2025-12-04T20:00:00Z'); // Thursday 8PM UK time

interface TimerInterval {
	time: number; // milliseconds before event
	message: string;
	ping?: string;
	isCountdown?: boolean; // true for 60 seconds countdown
}

const TIMER_INTERVALS: TimerInterval[] = [
	{ time: 48 * 60 * 60 * 1000, message: 'The Fracture is happening in 48 hours' },
	{ time: 24 * 60 * 60 * 1000, message: 'The Fracture is happening in 24 hours' },
	{ time: 12 * 60 * 60 * 1000, message: 'The Fracture is happening in 12 hours', ping: '@everyone' },
	{ time: 6 * 60 * 60 * 1000, message: 'The Fracture is happening in 6 hours', ping: '@everyone' },
	{ time: 3 * 60 * 60 * 1000, message: 'The Fracture is happening in 3 hours', ping: '@everyone' },
	{ time: 2 * 60 * 60 * 1000, message: 'The Fracture is happening in 2 hours', ping: '@everyone' },
	{ time: 1 * 60 * 60 * 1000, message: 'The Fracture is happening in 1 hour', ping: '@everyone' },
	{ time: 30 * 60 * 1000, message: 'The Fracture is happening in 30 minutes', ping: '@here' },
	{ time: 10 * 60 * 1000, message: 'The Fracture is happening in 10 minutes', ping: '@here' },
	{ time: 1 * 60 * 1000, message: 'T-Minus 60 seconds', isCountdown: true },
];

let countdownIntervals: NodeJS.Timeout[] = [];
let countdownMessageId: string | null = null;

async function scheduleCountdown(channel: TextChannel, eventTimeMs: number): Promise<void> {
	// Clear any existing timers
	countdownIntervals.forEach(interval => clearTimeout(interval));
	countdownIntervals = [];

	const now = new Date().getTime();

	for (const interval of TIMER_INTERVALS) {
		const triggerTime = eventTimeMs - interval.time;

		if (triggerTime > now) {
			const delayMs = triggerTime - now;

			const timeoutId = setTimeout(async () => {
				try {
				if (interval.isCountdown) {
					// Send initial T-Minus 60 message as embed
					const tminusEmbed = new EmbedBuilder()
						.setColor(0xFF0000)
						.setTitle('T-Minus 60 seconds')
						.setDescription('The Fracture is about to begin.')
						.setTimestamp();

					const message = await channel.send({ embeds: [tminusEmbed] });
					countdownMessageId = message.id;

					// Start countdown from 60 to 0
					for (let i = 59; i >= 0; i--) {
						await new Promise(resolve => setTimeout(resolve, 1000));
						try {
							const msg = await channel.messages.fetch(countdownMessageId!);
							const updatedEmbed = new EmbedBuilder()
								.setColor(0xFF0000)
								.setTitle(`T-Minus ${i} seconds`)
								.setDescription('The Fracture is about to begin.')
								.setTimestamp();

							await msg.edit({ embeds: [updatedEmbed] });
						}
						catch (err) {
							console.error('Error updating countdown message:', err);
							break;
						}
					}					// Send event started embed
					const embed = new EmbedBuilder()
						.setColor(0x4B0082)
						.setTitle('🌑 IMMIGRATION SYSTEM HAS BEGUN 🌑')
						.setDescription('The Fracture is happening. The boundaries between order and chaos have collapsed.')
						.addFields(
							{ name: '⚠️ Alert', value: 'The immigration phase has commenced. All unassigned members are now being classified and distributed.', inline: false }
						)
						.setFooter({ text: 'The Presence Observes' })
						.setTimestamp();

					await channel.send({ embeds: [embed] });
					}
					else {
						// Send regular message
						const msg = interval.ping ? `${interval.ping} ${interval.message}` : interval.message;
						await channel.send(msg);
					}
				}
				catch (err) {
					console.error(`Error sending countdown message: ${interval.message}`, err);
				}
			}, delayMs);

			countdownIntervals.push(timeoutId);
		}
	}
}

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('countdown')
		.setDescription('Start the countdown to The Fracture (Thursday 8PM UK time, December 4 2025)')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel to send countdown messages to')
				.setRequired(true)
		)
		.addIntegerOption(option =>
			option
				.setName('test_seconds')
				.setDescription('(TEST MODE) Set event time to X seconds from now instead of Dec 4')
				.setRequired(false)
				.setMinValue(30)
				.setMaxValue(3600)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async (interaction) => {
		await interaction.deferReply({ flags: ['Ephemeral'] });

		const channel = interaction.options.getChannel('channel') as TextChannel;
		const testSeconds = interaction.options.getInteger('test_seconds');

		if (!channel || !channel.isTextBased()) {
			await interaction.editReply('Please select a valid text channel.');
			return;
		}

		try {
			const now = new Date().getTime();
			
			// Use test time if provided, otherwise use actual event time
			let eventTimeMs = EVENT_TIME.getTime();
			if (testSeconds) {
				eventTimeMs = now + (testSeconds * 1000);
			}

			if (now >= eventTimeMs) {
				await interaction.editReply('The Fracture has already started!');
				return;
			}

			await scheduleCountdown(channel, eventTimeMs);

			if (testSeconds) {
				await interaction.editReply(`✅ TEST MODE: Countdown scheduled! The Fracture in ${testSeconds} seconds.`);
			}
			else {
				const hoursUntilEvent = Math.floor((eventTimeMs - now) / (60 * 60 * 1000));
				await interaction.editReply(`✅ Countdown scheduled! The Fracture in ${hoursUntilEvent} hours.`);
			}
		}
		catch (err) {
			console.error('Error starting countdown:', err);
			await interaction.editReply('There was an error starting the countdown.');
		}
	},
};

export default command;
