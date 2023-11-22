const { TicTacToe } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('tic-tac-toe')
    .setDescription('Play a game of Tic Tac Toe!')
    .addUserOption(option => option.setName('user').setDescription('User to play Tic Tac Toe with!').setRequired(true)),
    async execute (interaction) {
        const Game = new TicTacToe({
        message: interaction,
        isSlashGame: true,
        opponent: interaction.options.getUser('user'),
        embed: {
            title: 'Tic Tac Toe',
            color: '#575757',
            statusTitle: 'Status',
            overTitle: 'Game Over'
        },
        emojis: {
            xButton: '❌',
            oButton: '🔵',
            blankButton: '➖'
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: 'DANGER',
        oButtonStyle: 'PRIMARY',
        turnMessage: '{emoji} | its turn of **{player}**',
        winMessage: '{emoji} | **{player}** won the TicTacToe Game!',
        tieMessage: 'The game tied! No one won the game. :/',
        timeoutMessage: 'The game went unfinished! No one won the game.',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
        });

        Game.startGame();
        Game.on('gameover', result => {
            return;
        })
    }
}