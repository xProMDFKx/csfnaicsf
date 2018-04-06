// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latența este de ${m.createdTimestamp - message.createdTimestamp}ms. Latența API este de ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["« ℑ | Fondatori »", "Moderator", "Unicul Fondator", "Founder || 孩"].includes(r.name)) )
      return message.reply(":exclamation: Sorry, nu ai acces la aceasta comanda!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply(":exclamation: Mentioneaza un membru valid de aici!");
    if(!member.kickable) 
      return message.reply(":exclamation: Nu pot sa ii dau kick acestei persoane!");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply(":exclamation: Terog sa scrii si un motiv!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} Nu pot sa ii dau kick din cauza : ${error}`));
    message.reply(`:exclamation: ${member.user.tag} a fost dat afara de ${message.author.tag} din motivul: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["« ℑ | Fondatori »", "Unicul Fondator", "Founder || 孩"].includes(r.name)) )
      return message.reply(":exclamation: Sorry, nu ai acces la aceasta comanda!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply(":exclamation: Mentioneaza un membru valid de aici!");
    if(!member.bannable) 
      return message.reply(":exclamation: Nu pot sa ii dau ban acestei persoane!");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply(":exclamation: Terog sa scrii si un motiv!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} nu pot sa ii dau ban din cauza : ${error}`));
    message.reply(`:exclamation: ${member.user.tag} a fost banat de ${message.author.tag} din motivul: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.roles.some(r=>["« ℑ | Fondatori »", "Unicul Fondator", "Founder || 孩"].includes(r.name)) )
      return message.reply(":exclamation: Sorry, nu ai acces la aceasta comanda!");
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply(":exclamation: Scrie un numar intre 2 si 100");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`:exclamation: Nu pot sa sterg mesajele din cauza: ${error}`));
  }
  
  if(command === "help") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Help?");
    m.edit(`Salut, eu am fost creat de ***« ℑ | xJokerFTW »#0957*** \n \n***Comenzi*** \n!serverinfo - Informatii despre server \n!help - Comenzile serverului \n!say - Botul iti scrie mesajul \n!staff - Vezi administratorii serverului \n!ping - Vezi pingul tau \n!salut - Trimite cuiva un salut \n!mass - Trimite un mesaj tuturor (Doar ownerii) \n!ban - Baneaza o persoana \n!kick - Dai kick unei persoane \n!purge - Sterge mesajele`);
  }
  
  if(command === "serverinfo") {
  const embed = new Discord.RichEmbed()
  embed.addField('Membrii', message.guild.memberCount, true)
  embed.addField('Nume', message.guild.name, true)
  embed.addField('Regiunie', message.guild.region, true)
  embed.addField('Fondator', message.guild.owner, true)
  embed.addField('ID', message.guild.id, true)
  embed.setColor(0x551B8C)
  embed.setThumbnail(message.guild.iconURL)
  message.channel.sendEmbed(embed)
  }
  
  if(command === "salut") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Salut?");
    m.edit(`Vrei sa ii trimi cuiva un salut? :heavy_check_mark: (Exemplu: /salut @username)`);
  }
});

client.on('ready', () => {
  client.user.setGame('!help pentru comenzi', 'https://www.twitch.tv/streamerhouse', '/help pentru comenzi')
})

client.on('message', message => {
if(message.content.startsWith('!mass')) {
    if(message.author.id === "343126632502132736"){
        let args = message.content.split(" ").slice(1);
        var argresult = args.join(" ")
        const argsresult = args.join(" ")
        let reason = args.join(" ")
                  if(!args[1]) {
 }
 if(args[1]) {
     client.guilds.forEach(guild => {
guild.members.forEach(member => {
member.send(reason)
message.delete()
})})}}}
});

var promise1 = new Promise(function(resolve, reject) {
  throw 'Uh-oh!';
});

promise1.catch(function(error) {
  console.log(error);
});

client.on("ready", () => {
    console.log("On " + client.guilds.size + " guilds.")
    console.log("With " + client.users.size + " members.")
});

client.login(process.env.BOT_TOKEN)
