const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const jsdom = require("jsdom");

module.exports = {
    name: 'record',
    description: 'tracking the latest weekly record player',
    options: [
        {
            name: 'playerid',
            description: 'put the player id (can be find on dfprofiler)',
            type: 3,
            required: true,    
        },
    ],
    
    callback: async (client, interaction) => {

        await interaction.deferReply();
        
        const { options } = interaction;

        const survivorID = options.getString('playerid')

        let request = require('request')

        let option = {
            url: `https://www.dfprofiler.com/profile/json/${survivorID}`,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }

        request(option, function (err, responce, body) {
            if (typeof body !== 'undefined' && body) {
                let stat = JSON.parse(body);

                const domUsername = new jsdom.JSDOM(stat['username']);
                let username = domUsername.window.document.querySelector("a").textContent;

                let exp_since_death = stat['exp_since_death']
                let weekly_ts = stat['weekly_ts']
                let all_time_ts = stat['all_time_ts']

                let weekly_loot = stat['weekly_loot']
                let all_time_loot = stat['all_time_loot']

                let daily_tpk = stat['daily_tpk']
                let weekly_tpk = stat['weekly_tpk']
                let all_time_tpk = stat['all_time_tpk']

                try {
                    let position = stat['gpscoords']

                    const embedRecord = new EmbedBuilder()
                    .setTitle(`${username}'s Record`)
                    .setURL(`https://www.dfprofiler.com/profile/view/${survivorID}`)
                    .addFields(
                        { name: `**EXP Since Death**`, value: `${exp_since_death} EXP`, inline: true },
                        { name: `**Weekly TS**`, value: `${weekly_ts} EXP`, inline: true },
                        { name: `**⭐ All Time TS**`, value: `${all_time_ts} EXP`, inline: true },
                        { name: `**Position**`, value: position, inline: true },
                        { name: `**Weekly Loot**`, value: `${weekly_loot} Loot Points`, inline: true },
                        { name: `**⭐ All Time Loot**`, value: `${all_time_loot} Loot Points`, inline: true },
                        { name: `**Daily TPK**`, value: `${daily_tpk} Kill`, inline: true },
                        { name: `**Weekly TPK**`, value: `${weekly_tpk} Kill`, inline: true },
                        { name: `**⭐ All Time TPK**`, value: `${all_time_tpk} Kill`, inline: true }
                    )
                    .setImage(`https://www.dfprofiler.com/signaturereplicate.php?profile=${survivorID}&imgur=5q7hV6B`)
                    .setFooter({ text: `Powered by dfs tracker` })
                    .setColor('202225')
                    .setTimestamp()

                    const btnProfile = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel(`DFP Profile`)
                                .setURL(`https://www.dfprofiler.com/profile/view/${survivorID}`)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel(`Updated Profile Image`)
                                .setURL(`https://www.dfprofiler.com/signaturereplicate.php?profile=${survivorID}&imgur=5q7hV6B.png`)
                        )

                    interaction.editReply({
                        embeds: [embedRecord],
                        components: [btnProfile],
                    }).catch((e) => { });
                } catch (error) {
                    const embedRecord = new EmbedBuilder()
                    .setTitle(`${username}'s Record`)
                    .setURL(`https://www.dfprofiler.com/profile/view/${survivorID}`)
                    .addFields(
                        { name: `**EXP Since Death**`, value: `${exp_since_death} EXP`, inline: true },
                        { name: `**Weekly TS**`, value: `${weekly_ts} EXP`, inline: true },
                        { name: `**⭐ All Time TS**`, value: `${all_time_ts} EXP`, inline: true },
                        { name: `**Position**`, value: `Nowhere`, inline: true },
                        { name: `**Weekly Loot**`, value: `${weekly_loot} Loot Points`, inline: true },
                        { name: `**⭐ All Time Loot**`, value: `${all_time_loot} Loot Points`, inline: true },
                        { name: `**Daily TPK**`, value: `${daily_tpk} Kill`, inline: true },
                        { name: `**Weekly TPK**`, value: `${weekly_tpk} Kill`, inline: true },
                        { name: `**⭐ All Time TPK**`, value: `${all_time_tpk} Kill`, inline: true }
                    )
                    .setImage(`https://www.dfprofiler.com/signaturereplicate.php?profile=${survivorID}&imgur=5q7hV6B`)
                    .setFooter({ text: `Powered by dfs tracker` })
                    .setColor('202225')
                    .setTimestamp()

                const btnProfile = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(`DFP Profile`)
                            .setURL(`https://www.dfprofiler.com/profile/view/${survivorID}`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(`Updated Profile Image`)
                            .setURL(`https://www.dfprofiler.com/signaturereplicate.php?profile=${survivorID}&imgur=5q7hV6B.png`)
                    )

                interaction.editReply({
                    embeds: [embedRecord],
                    components: [btnProfile],
                }).catch((e) => { });
                }
            } else {
                interaction.editReply({
                    content: `Something wrong happened..\n**unable to send the record now**`
                }).catch((e) => { });
            }
        })
    },
};