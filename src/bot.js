require("dotenv").config();

const {
  Client,
  MessageFlags,
  MessageAttachment,
  Message,
  WebhookClient,
} = require("discord.js");

const client = new Client({
  partials: ["MESSAGE", "REACTION", "CHANNEL", "GUILD_MEMBER", "USER"],
});

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in...`);
});

client.on("message", (message) => {
  console.log(message.content);
  if (message.content.includes("!live")&&message.channel=="766528368337354803") {
    webhookClient.send(message.content);
  }
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "kick") {
      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You do not have permission");
      if (args.length === 0) return message.reply("Please provide an ID");
      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked!`))
          .catch((err) => message.channel.send("I cannot kick that user :("));
      } else {
        message.channel.send("That member was not found");
      }
    } else if (CMD_NAME === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("You do not have permission");
      if (args.length === 0) return message.reply("Please provide an ID");
      try {
        message.guild.members.ban(args[0]);
        console.log(user);
      } catch (err) {
        console.log(err);
        message.channel.send("Error(permission/user doesn't exist.");
      }
    } else if (CMD_NAME === "announcements") {
      const msg = args.join(" ");
      webhookClient.send(msg);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "772532157415555082") {
    switch (name) {
      case "🍎":
        member.roles.add("772525795611770893");
        break;
      case "🍌":
        member.roles.add("772525793192181790");
        break;
      case "🍇":
        member.roles.add("772525852599648346");
        break;
    }
  }
});
client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "772532157415555082") {
    switch (name) {
      case "🍎":
        member.roles.remove("772525795611770893");
        break;
      case "🍌":
        member.roles.remove("772525793192181790");
        break;
      case "🍇":
        member.roles.remove("772525852599648346");
        break;
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
