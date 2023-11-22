const { SlashCommandBuilder } = require("discord.js");
const { Minesweeper } = require("discord-gamecord");
const db = require("../../utils/db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("minesweep")
    .setDescription("Play a Minesweeper game")
    .addNumberOption((option) =>
      option
        .setName("mines")
        .setDescription("number of mines")
        .setRequired(true)
    ),

  async execute(interaction) {
    const mine = interaction.options.getNumber("mines");

    const Game = new Minesweeper({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Minesweeper",
        color: "#5865F2",
        description: "Click on the buttons to reveal the blocks except mines.",
      },
      emojis: { flag: "🚩", mine: "💣" },
      mines: mine,
      timeoutTime: 60000,
      winMessage: "You won the Game! You successfully avoided all the mines.",
      loseMessage: "You lost the Game! Beaware of the mines next time.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();

    Game.on("gameOver", (result) => {
      const username = result.player.username
      if(result.result == 'win'){
        db.update('blockchain', 'accounts', {discord_account:`${username}`}, {
          $inc:{money:100}
        })

      }
      else{

      }      

    });
  },
};
