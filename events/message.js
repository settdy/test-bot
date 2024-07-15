const { EmbedBuilder } = require("discord.js");
require('dotenv').config();
module.exports = {
  name: "messageCreate",
  async execute(msg, client) {
    if (msg.author.bot || msg.author.id == process.env.userID || msg.attachments.size >0) return;
    if (!msg.guild) {
      await forwardDirectMessage(msg, client);
    } else if (msg.guild) {
      await forwardServerMessage(msg, client);
    }
  },
};
async function forwardServerMessage(msg) {
  const sent = await msg.reply('This is a custom reply') // this is a placeholder for the bot's response
  if (msg.guild.id !== process.env.serverID) return;
  const channel = msg.guild.channels.cache.get(process.env.channelID);
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setTitle("New Message in server")
    .setThumbnail(msg.author.displayAvatarURL())
    .setColor("Blue")
    .setDescription(`<@${msg.author.id}> said:\n${msg.content}`)
    .addFields({ name: "Jump to message", value: `[Link](${msg.url})` })
    .addFields({name: 'Bot reply', value: sent.content})
    .setTimestamp(Date.now());
  try { await channel.send({ embeds: [embed] });} catch (error) {
    console.error("Error forwarding server message:", error);
  }
  console.log("Received server message: " + msg.content);
}
async function forwardDirectMessage(msg, client) {
  console.log('DM')
  try {
    const sent = await msg.reply('This is what a bot would reply')  //placeholder text
  const guild = client.guilds.cache.get(process.env.serverID);
  if (!guild) return;
  const channel = guild.channels.cache.get(process.env.channelID);
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setTitle("New Message in DM")
    .setThumbnail(msg.author.displayAvatarURL())
    .setColor("Red")
    .setDescription(`<@${msg.author.id}> said:\n${msg.content}`)
    .addFields({name: 'Bot reply', value: sent.content})
    .setTimestamp(Date.now());
  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error forwarding direct message:", error);
  }
  console.log("Received direct message: " + msg.content);
} catch (error) {console.error(error)}
}