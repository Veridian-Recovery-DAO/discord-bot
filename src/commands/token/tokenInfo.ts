import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { getERC20TokenContract } from '../../services/thirdweb'; // Adjust path as needed
import { logger } from '../../utils/logger'; // Adjust path
import { ethers } from 'ethers';
import { TokenMetadata } from '@thirdweb-dev/sdk';

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
    let tokenMetadata: TokenMetadata;
    try {
      await interaction.deferReply();

      const contract = await getERC20TokenContract();
      
      const [metadata] = await Promise.all([
        contract.totalSupply(),
      ]);

      const response = await fetch(
        `https://insight.thirdweb.com/v1/tokens/lookup?symbol=${metadata.symbol}&chain=1`,
        {
          headers: {
            "x-client-id": process.env.THIRDWEB_CLIENT_ID as string,
          },
        },
      );
      tokenMetadata = await response.json();

      const embed = new EmbedBuilder()
        .setColor(0x00D1B2) // Teal color
        .setTitle(metadata.name || 'DAO Token Information')
        .setDescription(tokenMetadata.description || 'Details about our community token.')
        .setThumbnail(tokenMetadata.image || metadata.symbol || '') // Prefer image, fallback to symbol
        .addFields(
          { name: 'Symbol', value: metadata.symbol || 'N/A', inline: true },
          { name: 'Decimals', value: metadata.decimals?.toString() || 'N/A', inline: true },
          { name: 'Total Supply', value: `${ethers.utils.formatUnits(tokenMetadata.supply.toString(), tokenMetadata.decimals)} ${tokenMetadata.symbol}`, inline: true },
          { name: 'Contract Address', value: `\`${contract.getAddress()}\`` }
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Error fetching token info:', error);
      await interaction.deferReply({ flags: MessageFlags.Ephemeral});
      await interaction.editReply({ content: 'Could not fetch token information. Please ensure the contract address is correct.' });
    }
  }
  // Add other subcommands (transfer, purchase) handling below
}
