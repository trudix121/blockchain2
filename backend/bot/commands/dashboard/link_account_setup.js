const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("link_account_setup")
    .setDescription("Link Discord Account with DashBoard Account"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Link Account Tutorial")
      .setFields(
        {
          name: "Step 1",
          value: 'Click On "Link Discord Account!" From DashBoard Taskbar',
        },
        { name: "Step 2", value: "Click on 'Get Code' Button" },
        {
          name: "Step 3",
          value: "Type /link_account and put code and username",
        },
        { name: "Step 4", value: "Enjoy!" }
      )
      .setColor('DarkGold')
      interaction.reply({embeds: [embed]})
  },
};
