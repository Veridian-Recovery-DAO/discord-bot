// ... (existing imports and 'list' subcommand data)
import Meeting, { IMeeting } from '../../models/Meeting'; // Ensure IMeeting is exported or used appropriately
import { PermissionFlagsBits } from 'discord.js'; // For admin checks

// Modify the main SlashCommandBuilder for 'meetings'
export const data = new SlashCommandBuilder()
  .setName('meetings')
  .setDescription('Manage and view recovery meetings.')
  .addSubcommand(subcommand => // Keep the existing 'list' subcommand
    subcommand
      .setName('list')
      .setDescription('Lists upcoming recovery meetings.')
      .addStringOption(option =>
        option.setName('filter')
          .setDescription('Filter meetings (e.g., today, upcoming)')
          .addChoices(
            { name: 'Upcoming (default)', value: 'upcoming' },
            { name: 'Today', value: 'today' },
            { name: 'All Scheduled', value: 'all' }
          )))
  .addSubcommand(subcommand => // New 'modify' subcommand
    subcommand
      .setName('modify')
      .setDescription('[Admin] Modify an existing meeting.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents) // Or your DAO admin role
      .addStringOption(option => option.setName('meeting_id').setDescription('The ID of the meeting to modify (MongoDB _id)').setRequired(true))
      // Add options for each field you want to allow modification for
      .addStringOption(option => option.setName('name').setDescription('New name for the meeting'))
      .addStringOption(option => option.setName('description').setDescription('New description'))
      .addStringOption(option => option.setName('date').setDescription('New date (YYYY-MM-DD)'))
      .addStringOption(option => option.setName('time').setDescription('New time (HH:MM)'))
      // ... add other modifiable fields: duration, room, recurring status, etc.
  )
  .addSubcommand(subcommand => // New 'delete' subcommand
    subcommand
      .setName('delete')
      .setDescription('[Admin] Delete a scheduled meeting.')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents) // Or your DAO admin role
      .addStringOption(option => option.setName('meeting_id').setDescription('The ID of the meeting to delete (MongoDB _id)').setRequired(true)));

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'list') {
    // ... (existing listMeetings logic from previous response)
  } else if (subcommand === 'modify') {
    // Admin check (even with setDefaultMemberPermissions, an explicit check can be good)
    // if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageEvents)) {
    //   return interaction.reply({ content: "You don't have permission to modify meetings.", ephemeral: true });
    // }
    const meetingId = interaction.options.getString('meeting_id', true);
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        return interaction.reply({ content: "Invalid meeting ID format.", ephemeral: true });
    }

    const updates: Partial<IMeeting> & { $unset?: any } = {}; // Use Partial for updates
    const name = interaction.options.getString('name');
    if (name) updates.name = name;
    // ... collect other options similarly
    // Example for date/time (needs careful parsing like in scheduleMeeting)
    // const dateStr = interaction.options.getString('date');
    // const timeStr = interaction.options.getString('time');
    // if (dateStr && timeStr) {
    //   const newStartTime = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
    //   if (isValid(newStartTime)) updates.startTime = newStartTime;
    //   else return interaction.reply({ content: 'Invalid new date/time format.', ephemeral: true });
    // }


    if (Object.keys(updates).length === 0 && !updates.$unset) {
      return interaction.reply({ content: 'Please provide at least one field to modify.', ephemeral: true });
    }

    try {
      await interaction.deferReply({ephemeral: true});
      const updatedMeeting = await Meeting.findByIdAndUpdate(meetingId, { $set: updates }, { new: true });
      if (!updatedMeeting) {
        return interaction.editReply('Meeting not found or could not be updated.');
      }
      await interaction.editReply(`Meeting \`${updatedMeeting.name}\` (ID: ${meetingId}) updated successfully.`);
    } catch (error) {
      logger.error('Error modifying meeting:', error);
      await interaction.editReply('Failed to modify meeting.');
    }

  } else if (subcommand === 'delete') {
    // Admin check
    const meetingId = interaction.options.getString('meeting_id', true);
     if (!mongoose.Types.ObjectId.isValid(meetingId)) {
        return interaction.reply({ content: "Invalid meeting ID format.", ephemeral: true });
    }

    try {
      await interaction.deferReply({ephemeral: true});
      const deletedMeeting = await Meeting.findByIdAndDelete(meetingId);
      if (!deletedMeeting) {
        return interaction.editReply('Meeting not found or already deleted.');
      }
      await interaction.editReply(`Meeting \`${deletedMeeting.name}\` (ID: ${meetingId}) has been deleted.`);
    } catch (error) {
      logger.error('Error deleting meeting:', error);
      await interaction.editReply('Failed to delete meeting.');
    }
  }
}
