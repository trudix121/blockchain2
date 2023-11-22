const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discord_status")
    .setDescription("Get the bots ping"),
  async execute(interaction) {
    let circles = {
      good: "<:High:1112010799184093266> ",
      okay: "<:Mid:1112010795207893012> ",
      bad: "<:Low:1112010793924435988>",
    };

    await interaction.deferReply(); // Defer the reply before editing

    const pinging = await interaction.editReply({ content: "Pinging..." });

    const ws = interaction.client.ws.ping; // websocket ping
    const msgEdit = Date.now() - pinging.createdTimestamp; // api latency

    // uptime
    let days = Math.floor(interaction.client.uptime / 86400000);
    let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
    let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
    let seconds = Math.floor(interaction.client.uptime / 1000) % 60;

    const wsEmoji =
      ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
    const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

    const pingEmbed = new EmbedBuilder()
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
      .setColor("Blue")
      .setTimestamp()
      .setFooter({ text: `Pinged At` })
      .addFields(
        {
          name: "Websocket Latency",
          value:  `\`${ws}ms\``,
        },
        {
          name: "API Latency",
          value: ` \`${msgEdit}ms\``,
        },
        {
          name: `${interaction.client.user.username} Uptime`,
          value: `\`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``,
        }
      );

    await pinging.edit({ embeds: [pingEmbed], content: "\u200b" });
  },
};

// emojis - https://mega.nz/folder/UTQDUAYa#idGhPj-luwuPhr8MnhrkWA
