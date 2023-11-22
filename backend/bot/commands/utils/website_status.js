const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("website_status")
    .setDescription("Replies with your status!"),
  async execute(interaction) {
    let response = '';
    try {
      const res = await axios.get('http://us-nyc03.pylex.me:8507');
      await interaction.reply((res.status === 200) ? 'Website is UP' : 'Website is DOWN');
    } catch (error) {
      console.error(error);
      response = 'An error occurred while checking the website status';
      await interaction.reply(response);
    }
  },
}
