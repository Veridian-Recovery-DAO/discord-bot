import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import Meeting from '../../models/Meeting';
import { parse, isValid } from 'date-fns';
import { logger } from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('schedule-meeting')
  .setDescription('Schedules a new recovery meeting.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) // Example: only users who can manage channels
  .addStringOption(option => option.setName('name').setDescription('Name of the meeting').setRequired(true))
  .addStringOption(option => option.setName('description').setDescription('Short description').setRequired(true))
  .addStringOption(option => option.setName('date').setDescription('Date of the meeting (YYYY-MM-DD)').setRequired(true))
  .addStringOption(option => option.setName('time').setDescription('Time of the meeting (HH:MM, 24-hour format, e.g., 14:30)').setRequired(true))
  .addIntegerOption(option => option.setName('duration').setDescription('Duration in minutes').setRequired(true))
  .addStringOption(option => option.setName('room').setDescription('Meeting room link or info').setRequired(true))
  .addBooleanOption(option => option.setName('recurring').setDescription('Is this a recurring meeting? (default: false)'))
  .addStringOption(option => option.setName('recurrence_rule').setDescription('If recurring, describe the rule (e.g., "Daily", "Weekly on Mondays")'));

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  try {
    const name = interaction.options.getString('name', true);
    const description = interaction.options.getString('description', true);
    const dateStr = interaction.options.getString('date', true);
    const timeStr = interaction.options.getString('time', true);
    const duration = interaction.options.getInteger('duration', true);
    const room = interaction.options.getString('room', true);
    const recurring = interaction.options.getBoolean('recurring') || false;
    const recurrenceRule = interaction.options.getString('recurrence_rule');

    const dateTimeStr = `${dateStr} ${timeStr}`;
    // Example assumes UTC for simplicity, consider timezone handling for real app
    const startTime = parse(dateTimeStr, 'yyyy-MM-dd HH:mm', new Date());

    if (!isValid(startTime)) {
      return interaction.reply({ content: 'Invalid date or time format. Please use YYYY-MM-DD for date and HH:MM for time.', ephemeral: true });
    }

    const meeting = new Meeting({
      name,
      description,
      startTime,
      durationMinutes: duration,
      roomInfo: room,
      isRecurring: recurring,
      recurrenceRule: recurring ? recurrenceRule : undefined,
      createdBy: interaction.user.id,
    });

    await meeting.save();

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Meeting Scheduled Successfully!')
      .setDescription(`**${name}** has been scheduled.`)
      .addFields(
        { name: 'Description', value: description },
        { name: 'When', value: `${startTime.toLocaleString()} for ${duration} minutes` },
        { name: 'Room', value: room },
        { name: 'Recurring', value: recurring ? `Yes (${recurrenceRule || 'Not specified'})` : 'No' }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

  } catch (error) {
    logger.error('Error scheduling meeting:', error);
    await interaction.reply({ content: 'There was an error scheduling the meeting. Please try again.', ephemeral: true });
  }
}
