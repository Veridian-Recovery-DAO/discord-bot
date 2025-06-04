import { Client, GatewayIntentBits, Collection, Events, Interaction } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { connectDB } from './services/mongo';
import { logger } from './utils/logger';

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  logger.error("DISCORD_BOT_TOKEN is not defined in .env file");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // If you need to read message content (less common with slash commands)
  ],
});

// Extend Client type to include commands Collection
interface ClientWithCommands extends Client {
    commands?: Collection<string, any>;
}

const clientWithCommands: ClientWithCommands = client;
clientWithCommands.commands = new Collection();

const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js')); // After tsc compilation
  for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(path.join(__dirname, 'commands', folder, file));
    if (command.data && command.execute) {
      clientWithCommands.commands.set(command.data.name, command);
       logger.info(`Command loaded: ${command.data.name}`);
    } else {
      logger.warn(`Command file ${file} in folder ${folder} is missing 'data' or 'execute'.`);
    }
  }
}


client.once(Events.ClientReady, c => {
  logger.info(`Ready! Logged in as ${c.user.tag}`);
  connectDB(); // Connect to MongoDB when bot is ready
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = clientWithCommands.commands?.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    await interaction.reply({ content: 'Sorry, that command does not exist!', ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.login(token);
