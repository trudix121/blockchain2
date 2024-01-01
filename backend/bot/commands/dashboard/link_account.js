const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../utils/db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("link_account")
    .setDescription("Link Discord Account with DashBoard Account")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Username Of Your Account")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("Code Of Received of Website")
        .setRequired(true)
    ),

  async execute(interaction) {
    const username = interaction.options.getString("username");
    const code = interaction.options.getString("code");

    const data = await db.find_one("blockchain", "accounts", {
      username: username,
    });
    if (data != null) {
      if (data.discord_code == code) {
        if (data.discord_account === null) {
          await db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $set: { discord_account: interaction.user.username, discord_connected:1 } }
          );
          interaction.reply("Linked Succesfull");
        } else {
          await interaction.reply(
            `Already Linked! with account ${data.discord_account}`
          );
        }
      } else {
        interaction.reply("Incorect Code");
      }
    } else {
      interaction.reply("Incorect Username");
    }
  },
};
