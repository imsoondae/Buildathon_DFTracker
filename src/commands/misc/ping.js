module.exports = {
    name: 'hello',
    description: 'say hi to me!',

    callback: async (client, interaction) => {
        interaction.reply(
            `Hello World!`
        );
    },
};