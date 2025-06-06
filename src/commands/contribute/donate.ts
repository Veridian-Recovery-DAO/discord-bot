import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const daoTreasuryAddress = process.env.DAO_TREASURY_WALLET_ADDRESS;

export const data = new SlashCommandBuilder()
  .setName('donate')
  .setDescription('Support the DAO by donating tokens to the treasury.');

export async function execute(interaction: CommandInteraction) {
  if (!daoTreasuryAddress) {
    return interaction.reply({ content: 'Donation address is not configured. Please contact an admin.', ephemeral: true });
  }

  // Optional: Generate a QR code for the address (using a library like 'qrcode')
  // For simplicity, this example just shows the address.

  const embed = new EmbedBuilder()
    .setColor(0xFEE75C) // Yellow
    .setTitle('Donate to Veridian Recovery DAO Treasury')
    .setDescription(
`Your donations help fund DAO operations, development, and outreach programs.
You can send [Your DAO Token Symbol], ETH, or other compatible tokens on the [Your Network Name] network to our treasury address:`)
    .addFields({ name: 'Treasury Wallet Address', value: `\`${daoTreasuryAddress}\`` })
    // .setImage(qrCodeImageUrl) // If you generate a QR code
    .setFooter({ text: 'Thank you for your generous support! Verify the address carefully before sending.' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
