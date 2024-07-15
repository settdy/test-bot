const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder
} = require("discord.js");
require("dotenv").config();
module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .setName("settime")
    .setDescription("Set date and venue for the next meeting")
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Set a date")
        .setRequired(true)
    )
    .addStringOption((option)=> 
      option
      .setName("time")
      .setDescription("Set a time")
      .setRequired(true)
                    )
    .addStringOption((option) =>
      option
        .setName("venue")
        .setDescription("Set a venue")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("remarks")
        .setDescription("Set additional remarks")
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const venue = interaction.options.getString("venue");
      if (!venue) {
        await interaction.reply({ content: 'Please specify a venue.', ephemeral: true });
        return;
      }
      var remarks = interaction.options.getString("remarks") || "No additional remarks"; 
      if (remarks != 'No additional remarks') { remarks = `Remarks: ${remarks}`}
      const date = interaction.options.getString("date");
      const time = interaction.options.getString("time");
      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('Post?')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('postit')
      );
      const reply = await interaction.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle('Double check your inputs')
          .setDescription(`Next Meeting Details:\n Date: ${date} at ${time}\n Venue: ${venue} \n ${remarks}`)
        ],
        components: [buttons],
        ephemeral: true,
        fetchReply: true, // This will allow you to access the message later
      });
      const filter = (i) => i.user.id === interaction.user.id;
      const collector = reply.createMessageComponentCollector({
        ComponentType: ComponentType.Button,
        filter,
        time: 30000,
      });
      collector.on('collect', async (sus) => {
        if (sus.customId === 'postit') {
          await sus.deferUpdate();
          try {
            const channel = await interaction.client.channels.fetch(process.env.announcementID);
            if (!channel) {
              await sus.editReply({ content: 'Announcement channel not found.', ephemeral: true });
              return;
            }
            await channel.send({
              content: '@everyone',
              embeds: [
                new EmbedBuilder()
                  .setTitle('New Meeting')
                  .setTimestamp(Date.now())
                  .setDescription(`Our next meeting will be at on ${date} at ${venue}\n ${remarks}`)
                .setColor('Blue')
              ]
            });
            await sus.editReply({ content: "Alright, posting...", ephemeral: true }); // Update the button's reply
          } catch (error) {
            console.error(error);
            await sus.editReply({ content: 'An error occurred, try again later.', ephemeral: true }); // Update the button's reply
          }
        }
      });
      collector.on('end', (collected) => {
        console.log(`Collected ${collected.size} items`);
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Error occured, try again later", ephemeral: true });
    }
  }
}