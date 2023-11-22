const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config()
const axios = require('axios')
// Creează un obiect client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Creează o colecție pentru a stoca comenzile
client.commands = new Collection();

// Funcție pentru încărcarea comenzilor
const loadCommands = (dir) => {
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${dir}/${file}`);

        // Check if the command variable is undefined before using it
        if (command) {
            client.commands.set(command.data.name, command);
        }
    }

    // Check for subdirectories and load commands from them
    const subdirs = fs.readdirSync(dir).filter(subdir => fs.statSync(`${dir}/${subdir}`).isDirectory());
    for (const subdir of subdirs) {
        loadCommands(`${dir}/${subdir}`);
    }
}


// Load commands from each top-level folder
loadCommands('./backend/bot/commands');

client.once('ready', async () => {
	console.log(`Client Connected, ${client.user.tag}`);
	await client.application.commands.fetch();
	await  client.application.commands.cache.delete()
});

const CHANNEL_ID = "1173682764483145900"; //enter your channel id here// this is so the ai code of the bot can only respond in one channel
 
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== CHANNEL_ID) return; 
  if (message.content.startsWith("!")) return;
   console.log('debug')
 
  let conversationLog = [
    {
      role: "system",
      content:
        "You are a friendly discord Bot",
    },
  ];
 
  try {
    await message.channel.sendTyping();
    let prevMessages = await message.channel.messages.fetch({ limit: 15 });// the bot can retrieve old messages and hold a conversation
    prevMessages.reverse();
 
    prevMessages.forEach((msg) => {
      if (msg.content.startsWith("!")) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id == client.user.id) {
        conversationLog.push({
          role: "assistant",
          content: msg.content,
          name: msg.author.username
            .replace(/\s+/g, "_")
            .replace(/[^\w\s]/gi, ""),
        });
      }
 
      if (msg.author.id == message.author.id) {
        conversationLog.push({
          role: "user",
          content: msg.content,
          name: message.author.username
            .replace(/\s+/g, "_")
            .replace(/[^\w\s]/gi, ""),
        });
      }
    });
 
    // Now, let's handle the AI response part
    const input = {
      method: "GET",
      url: "https://google-bard1.p.rapidapi.com/",
      headers: {
        text: message.content,
        lang: "en",
        psid: "cwjsOpTDRJwTEfiGNE-SyR6gvzEHw4MmquNHPD2zfmjNAK6R19f2BHoGc9yMaydIwvxB8g.",// you must input your own psid using Micrsoft Edge. chrome will not work
        "X-RapidAPI-Key": "b25ea3be8amshd063e77bb9223d7p1985c0jsn348dce625571",
        "X-RapidAPI-Host": "google-bard1.p.rapidapi.com",
      },
    };
 
    try {
      const response = await axios.request(input);
 
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(response.data.response);
 
      await message.reply({ embeds: [embed] });
    } catch (e) {
      console.error("Error:", e);
      return await message.reply({
        content: "There was an issue getting that AI response. Try again later",
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);
