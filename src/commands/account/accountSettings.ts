import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import UserProfile from '../../models/UserProfile'; // Adjust path
import { logger } from '../../utils/logger'; // Adjust path
// Import NFT claim URL if needed for 'become-member'
// import { nftClaimPageUrl as membershipNftClaimPageUrl } from '../../services/thirdweb';

export const data = new SlashCommandBuilder()
  .setName('account')
  .setDescription('Manage your DAO account settings.')
  .addSubcommand(subcommand =>
    subcommand
      .setName('profile')
      .setDescription('View your DAO profile.'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('edit-profile')
      .setDescription('Modify your DAO profile.'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('become-member')
      .setDescription('Learn how to become an official DAO member (via NFT).'))
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete-account')
      .setDescription('Request deletion of your DAO account data.'));

// Helper function to get or create user profile
async function getOrCreateUserProfile(userId: string, username: string) {
  let userProfile = await UserProfile.findOne({ userId });
  if (!userProfile) {
    userProfile = new UserProfile({ userId, username, joinedDAOAt: new Date() });
    await userProfile.save();
  } else if (userProfile.username !== username) {
    userProfile.username = username; // Update username if it changed
    await userProfile.save();
  }
  return userProfile;
}


export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const subcommand = interaction.options.getSubcommand();
  const userId = interaction.user.id;
  const username = interaction.user.username;

  try {
    if (subcommand === 'profile') {
      await interaction.deferReply({ ephemeral: true });
      const profile = await getOrCreateUserProfile(userId, username);
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`${username}'s DAO Profile`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: 'Member Status', value: profile.isMember ? '✅ Official Member' : 'Guest', inline: true },
          { name: 'Joined DAO', value: profile.joinedDAOAt.toLocaleDateString(), inline: true },
          { name: 'Bio', value: profile.bio || 'Not set. Use `/account edit-profile` to add one!' },
          // { name: 'Recovery Interests', value: profile.recoveryInterests?.join(', ') || 'Not set' },
          // { name: 'Contribution Points', value: profile.contributionPoints?.toString() || '0' }
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });

    } else if (subcommand === 'edit-profile') {
      const profile = await getOrCreateUserProfile(userId, username);

      const modal = new ModalBuilder()
        .setCustomId(`editProfileModal_${userId}`)
        .setTitle('Edit Your DAO Profile');

      const bioInput = new TextInputBuilder()
        .setCustomId('bioInput')
        .setLabel("Your Bio (optional)")
        .setStyle(TextInputStyle.Paragraph)
        .setValue(profile.bio || '')
        .setMaxLength(250)
        .setRequired(false);

      // Add more fields like recoveryInterests if desired
      // const interestsInput = ...

      const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(bioInput);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);

      // Handle modal submission in your main bot's interactionCreate event
      // (See separate handling for modals below)

    } else if (subcommand === 'become-member') {
      // This would be similar to your `/buy-nft` command
      const membershipNftClaimPageUrl = process.env.MEMBERSHIP_NFT_CLAIM_PAGE_URL; // Add to .env
      if (!membershipNftClaimPageUrl) {
        return interaction.reply({ content: 'Membership NFT claim page is not configured yet.', ephemeral: true });
      }
      const embed = new EmbedBuilder()
        .setColor(0x1ABC9C)
        .setTitle('Become an Official DAO Member')
        .setDescription(`Acquire our official Membership NFT to unlock exclusive benefits and governance rights!
        [Click here to claim your Membership NFT](${membershipNftClaimPageUrl})`)
        .setFooter({ text: "Holding this NFT signifies your membership." });
      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'delete-account') {
      // WARNING: This is a destructive action and needs careful consideration.
      // Provide clear warnings and perhaps a confirmation step.
      await interaction.deferReply({ ephemeral: true });
      // For now, just a confirmation message. Real deletion is complex.
      // A real implementation might:
      // 1. Anonymize data in UserProfile (e.g., set bio to "Deleted User")
      // 2. Re-attribute created meetings to a generic DAO admin if needed.
      // 3. Comply with any data retention policies.

      // Simple deletion for example (USE WITH EXTREME CAUTION):
      // await UserProfile.deleteOne({ userId });
      // logger.info(`User data deletion requested for ${userId}`);

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('Account Deletion Request')
        .setDescription(

`You've requested to delete your DAO-specific account data.
Currently, this feature is under review for safe implementation.
Please contact a DAO administrator directly if you need your data removed urgently.
What this means (conceptually):
 * Your DAO profile (bio, etc.) would be removed.
 * Data like meeting schedules you created might be anonymized or re-assigned.
 * This does not delete your Discord account itself.
   `)
   .setFooter({text: "Data privacy is important to us."});
   await interaction.editReply({ embeds: [embed]});
   }
   } catch (error) {
   logger.error('Error in account command for ' + subcommand + ':', error);
   if (!interaction.replied && !interaction.deferred) {
   await interaction.reply({ content: 'An error occurred. Please try again.', ephemeral: true });
   } else {
   await interaction.followUp({ content: 'An error occurred. Please try again.', ephemeral: true });
   }
   }
   }
