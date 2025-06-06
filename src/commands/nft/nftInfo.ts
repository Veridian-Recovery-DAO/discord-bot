import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getNFTContract, nftContractAddress, nftClaimPageUrl } from '../../services/thirdweb';
import { logger } from '../../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('nft-info')
  .setDescription('Get information about the Veridian Recovery DAO NFT.');

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand() || !nftContractAddress) {
     logger.warn('NFT Contract Address not configured for nft-info command.');
     return interaction.reply({ content: 'NFT information is not available at this moment.', ephemeral: true });
  }

  try {
    await interaction.deferReply();
    const contract = await getNFTContract();
    const metadata = await contract.metadata.get();
    // const claimConditions = await contract.erc721.claimConditions.getActive(); // For ERC721

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle(metadata.name || 'Veridian Recovery DAO NFT')
      .setDescription(metadata.description || 'Learn more about our community support NFT.')
      .setThumbnail(metadata.image || '') // Ensure you have an image in your NFT metadata
      // .addFields(
      //   { name: 'Price', value: claimConditions ? `${ethers.utils.formatEther(claimConditions.price)} ${claimConditions.currencyMetadata.symbol}` : 'Not set' },
      //   { name: 'Available', value: claimConditions ? `${claimConditions.availableSupply} / ${claimConditions.maxClaimableSupply}` : 'N/A' }
      // ) // You'll need to adjust this based on ERC721 or ERC1155 and how you set conditions
      .addFields({ name: 'Contract Address', value: `\`${nftContractAddress}\``});


    if (nftClaimPageUrl) {
      embed.addFields({ name: 'Claim Here', value: `[Visit Claim Page](${nftClaimPageUrl})` });
    }


    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    logger.error('Error fetching NFT info:', error);
    await interaction.editReply({ content: 'Could not fetch NFT information. Please try again later.'/*, ephemeral: true */});
  }
}
