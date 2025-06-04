import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import Meeting from '../../models/Meeting';
import { format } from 'date-fns';
import { logger } from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('meetings')
  .setDescription('Lists upcoming recovery meetings.')
  .addStringOption(option =>
    option.setName('filter')
      .setDescription('Filter meetings (e.g., today, upcoming)')
      .addChoices(
        { name: 'Upcoming (default)', value: 'upcoming' },
        { name: 'Today', value: 'today' },
        { name: 'All Scheduled', value: 'all' }
      )
  );

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  try {
    await interaction.deferReply(); // Defer reply as DB query might take time

    const filter = interaction.options.getString('filter') || 'upcoming';
    let query = {};
    const now = new Date();

    if (filter === 'upcoming') {
      query = { startTime: { $gte: now } };
    } else if (filter === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      query = { startTime: { $gte: startOfDay, $lte: endOfDay } };
    }
    // For 'all', query is empty (or you might want to limit to non-past meetings still)

    const meetings = await Meeting.find(query).sort({ startTime: 1 }).limit(10); // Limit to 10 for display

    if (meetings.length === 0) {
      await interaction.editReply('No meetings found matching your criteria.');
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`Recovery Meetings (${filter.charAt(0).toUpperCase() + filter.slice(1)})`)
      .setDescription('Here are the scheduled meetings:');

    meetings.forEach(meeting => {
      embed.addFields({
        name: `${meeting.name} (${format(meeting.startTime, 'MMM d, yyyy HH:mm')} UTC)`, // Clarify Timezone
        value: `*Description:* ${meeting.description}\n*Duration:* ${meeting.durationMinutes} mins\n*Room:* ${meeting.roomInfo}${meeting.isRecurring ? `\n*Recurring:* ${meeting.recurrenceRule || 'Yes'}`: ''}`
      });
    });

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    logger.error('Error listing meetings:', error);
    await interaction.editReply({ content: 'There was an error fetching meetings.', ephemeral: true });
  }
}

