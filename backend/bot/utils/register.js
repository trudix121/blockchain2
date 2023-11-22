const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config({path:'../.env'})

const commands = [];
const commandFolders = fs.readdirSync('../commands');

const loadCommands = (dir) => {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${dir}/${file}`);
        commands.push(command.data.toJSON());
    }

    // Check for subdirectories and load commands from them
    const subdirs = fs.readdirSync(dir).filter(subdir => fs.statSync(`${dir}/${subdir}`).isDirectory());
    for (const subdir of subdirs) {
        loadCommands(`${dir}/${subdir}`);
    }
}

// Load commands from each top-level folder
for (const folder of commandFolders) {
    loadCommands(`../commands/${folder}`);
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
 
    await rest.put(
      Routes.applicationCommands(process.env.clientId, process.env.guildId),
      { body: commands },
    );
 
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
 })();
