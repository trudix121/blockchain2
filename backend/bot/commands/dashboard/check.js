const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../utils/db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check_account")
    .setDescription("view account details instantly from discord")
    .addStringOption((option) =>
      option
        .setName("account_name")
        .setDescription("name of account")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("account_name");
    let details = await retrieve_details(input);
    async function check_ban() {
      if (details.ban === true) return true;
      else {
        return false;
      }
    }

    const embed = new EmbedBuilder().setTitle(`${input} Details`).addFields(
      { name: "Username", value: `${details.username}` },
      { name: "Money", value: `${details.money}$` },
      { name: "ETHM", value: `${details.ethm}` }
      /*{ name: "Banned", value: `${JSON.stringify(check_ban())}` }*/
    );

    await interaction.reply({ embeds: [embed] });
  },
};

async function check_ban() {
  if (details.ban === true) return true;
  else {
    return false;
  }
}

async function retrieve_details(input) {
  return await db.find_one("blockchain", "accounts", {
    username: input,
  });
}
