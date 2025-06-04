import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../../utils/logger';

dotenv.config();

const LLM_API_URL = process.env.LLM_API_URL;

export const data = new SlashCommandBuilder()
  .setName('ask')
  .setDescription('Ask a question related to addiction recovery or get support.')
  .addStringOption(option => option.setName('query').setDescription('Your question or concern').setRequired(true));

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;
  if (!LLM_API_URL) {
    logger.error('LLM_API_URL is not defined.');
    return interaction.reply({ content: 'The LLM service is currently unavailable. Please try again later.', ephemeral: true });
  }

  const query = interaction.options.getString('query', true);

  try {
    await interaction.deferReply();

    // IMPORTANT DISCLAIMER
    const disclaimer = "> :warning: **Disclaimer:** I am an AI assistant. My responses are for informational and educational purposes only and are not a substitute for professional medical advice, diagnosis, therapy, or crisis intervention. If you are in crisis or need immediate help, please contact a local emergency number or a crisis hotline. Resources are available in this server or can be provided by moderators.";

    const response = await axios.post(LLM_API_URL, {
      query: query,
      userId: interaction.user.id, // Optionally send user ID for context or logging on LLM service side
    });

    const llmResponse = response.data.answer || "Sorry, I couldn't get a response at this moment.";

    const embed = new EmbedBuilder()
      .setColor(0x4CAF50)
      .setTitle('Veridian Recovery AI Assistant')
      .setDescription(llmResponse)
      .addFields({ name: 'Important Note', value: disclaimer})
      .setFooter({text: `Query by ${interaction.user.username}`})
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

  } catch (error: any) {
    logger.error('Error interacting with LLM service:', error.message);
    if (axios.isAxiosError(error) && error.response) {
        logger.error('LLM Service Response Error:', error.response.data);
    }
    await interaction.editReply({ content: 'Sorry, I encountered an error while trying to reach the AI assistant. Please try again later.', ephemeral: true });
  }
}
