import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from './utils/logger';

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID; // For guild-specific commands (faster updates)

if (!token || !clientId) {
  logger.error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in .env file.');
  process.exit(1);
}

const commands = [];
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js') || file.endsWith('.ts')); // .js if you run compiled code
  for (const file of commandFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(path.join(__dirname, 'commands', folder, file));
    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
      logger.info(`Loaded command: ${command.data.name}`);
    } else {
      logger.warn(`Command file ${file} is missing 'data' or 'execute'.`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    logger.info('Started refreshing application (/) commands.');

    if (guildId) { // For development, deploy to a specific guild
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      logger.info(`Successfully reloaded application (/) commands for guild ${guildId}.`);
    } else { // For production, deploy globally (takes up to an hour to propagate)
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
      logger.info('Successfully reloaded application (/) commands globally.');
    }
  } catch (error) {
    logger.error('Error reloading commands:', error);
  }
})();
