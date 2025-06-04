import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getERC20TokenContract } from '../../services/thirdweb'; // Adjust path as needed
import { logger } from '../../utils/logger'; // Adjust path
import { ethers } from 'ethers';

export const data = new SlashCommandBuilder()
  .setName('token')
  .setDescription('Interact with the DAO ERC20 token.')
  .addSubcommand(subcommand =>
    subcommand
      .setName('info')
      .setDescription('Get information about the DAO token.'));

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'info') {
    try {
      await interaction.deferReply();
      const contract = await getERC20TokenContract();
      const [metadata, totalSupply] = await Promise.all([
        contract.metadata.get(),
        contract.totalSupply(),
      ]);

      const embed = new EmbedBuilder()
        .setColor(0x00D1B2) // Teal color
        .setTitle(metadata.name || 'DAO Token Information')
        .setDescription(metadata.description || 'Details about our community token.')
        .setThumbnail(metadata.image || metadata.symbol || '') // Prefer image, fallback to symbol
        .addFields(
          { name: 'Symbol', value: metadata.symbol || 'N/A', inline: true },
          { name: 'Decimals', value: metadata.decimals?.toString() || 'N/A', inline: true },
          { name: 'Total Supply', value: `${ethers.utils.formatUnits(totalSupply.value, totalSupply.decimals)} ${totalSupply.symbol}`, inline: true },
          { name: 'Contract Address', value: `\`${contract.getAddress()}\`` }
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Error fetching token info:', error);
      await interaction.editReply({ content: 'Could not fetch token information. Please ensure the contract address is correct.', ephemeral: true });
    }
  }
  // Add other subcommands (transfer, purchase) handling below
}
