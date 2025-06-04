import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { nftClaimPageUrl } from '../../services/thirdweb';
import { logger } from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('buy-nft')
  .setDescription('Provides a link to purchase the Veridian Recovery DAO NFT.');

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  if (!nftClaimPageUrl) {
    logger.warn('NFT Claim Page URL not configured.');
    return interaction.reply({ content: 'The NFT purchase link is not configured yet. Please check back later.', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setColor(0x3498DB)
    .setTitle('Purchase Veridian Recovery DAO NFT')
    .setDescription(`You can support our DAO and get your exclusive NFT by visiting our secure claim page.`)
    .addFields({ name: 'Claim Your NFT', value: `[Click here to go to the claim page](${nftClaimPageUrl})`})
    .setFooter({ text: 'Connect your wallet on the page to complete the purchase.' });

  await interaction.reply({ embeds: [embed], ephemeral: true }); // Ephemeral so only user sees it
}
