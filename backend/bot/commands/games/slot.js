const { Slots } = require("discord-gamecord");
const { SlashCommandBuilder } = require("discord.js");
const db = require('../../utils/db')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("slot")
    .setDescription("Play a Slot game"),

    async execute(interaction) {
    const { Slots } = require("discord-gamecord");

    const Game = new Slots({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Slot Machine",
        color: "#5865F2",
      },
      slots: ["🍇", "🍊", "🍋", "🍌"],
    });

    Game.startGame();
    Game.on("gameOver", (result) => {
      console.log(result); // =>  { result... }
      const username = result.player.username
      if(result.result == 'win'){
        db.update('blockchain', 'accounts', {discord_account:`${username}`}, {
          $inc:{money:10000}
        })

      }
      else{

      }  
    });
  },
};
