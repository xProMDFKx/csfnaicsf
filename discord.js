const Discord = require("discord.js");
const client = new Discord.Client();
const embed = new Discord.RichEmbed()
const prefix = "/"
client.on('message', message => {
  let args = message.content.split(" ").slice(1);

//SAY
  if(message.content.startsWith(prefix + "say"))  {
         message.delete()
         const embed = new Discord.RichEmbed()
         .setDescription(args.join(" "))
         .setColor(0xC0C0C0)
    message.channel.sendEmbed(embed);
 
}
//SERVERINFO
if (message.content.startsWith(prefix + 'serverinfo')) {
  const embed = new Discord.RichEmbed()
  embed.addField('Members', message.guild.memberCount, true)
  embed.addField('Name', message.guild.name, true)
  embed.addField('Region', message.guild.region, true)
  embed.addField('Owner', message.guild.owner, true)
  embed.addField('ID', message.guild.id, true)
  embed.setColor(0xC0C0C0)
  embed.setThumbnail(message.guild.iconURL)
  message.channel.sendEmbed(embed)
  
}
//SCA
    if (message.content === '/help') {
    	message.reply('Salut, eu am fost creat de ***« ℑ | xJokerFTW »#0957*** \n \n***Comenzi*** \n/serverinfo - Informatii despre server \n/help - Comenzile serverului \n/say - Botul iti scrie mesajul \n/staff - Vezi administratorii serverului \n/ping - Vezi pingul tau \n/salut - Trimite cuiva un salut \n/mass - Trimite un mesaj tuturor (Doar ownerii)');
      
    }  
//SFSA
    if (message.content === "/salut") { // creates the command cookie
        if (args[1]) message.channel.send(message.author.toString() + " has given " + args[1].toString() + " a cookie! :cookie:") // sends the message saying someone has given someone else a cookie if someone mentions someone else
        else message.channel.send("Vrei sa ii trimi cuiva un salut? :heavy_check_mark: (Exemplu: /salut @username)") // sends the error message if no-one is mentioned
      
    }
//SASASA
if (message.content.startsWith(prefix + 'serverinfo1235')) {
  const embed = new Discord.RichEmbed()
  embed.setTitle("**List of Commands**\n") // sets the title to List of Commands
  embed.addField(" - help", "Displays this message (Correct usage: *help)") // sets the first field to explain the command *help
  embed.addField(" - info", "Tells info about myself :grin:") // sets the field information about the command *info
  embed.addField(" - ping", "Tests your ping (Correct usage: *ping)") // sets the second field to explain the command *ping
  embed.addField(" - cookie", "Sends a cookie to the desired player! :cookie: (Correct usage: *cookie @username)") // sets the third field to explain the command *cookie
  embed.addField(" - 8ball", "Answers to all of your questions! (Correct usage: *8ball [question])") // sets the field to the 8ball command
  embed.setColor(0xC0C0C0) // sets the color of the embed box to orange
  embed.setFooter("You need help, do you?") // sets the footer to "You need help, do you?"
  message.channel.sendEmbed(embed)
    }
});

client.on('message', message => {
    if(message.content.startsWith("/ping")) {
            message.reply(new Date().getTime() - message.createdTimestamp + " ms, pingul tau");      
    }
});

client.on(`message`, msg => {
const memelink = [""]


if (msg.content.startsWith(`-memes`)) {
   msg.channel.send({file: memelink[Math.floor(Math.random() * memelink.length)]}).catch(err => {console.log(err)})
}
})

client.on('ready', () => {
  client.user.setGame('/help pentru comenzi', 'https://www.twitch.tv/streamerhouse', '/help pentru comenzi')
})

client.on('message', message => {
if(message.content.startsWith('/mass')) {
    if(message.author.id === "315398787709272064"){
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

client.on("ready", () => {
    console.log("On " + client.guilds.size + " guilds.")
    console.log("With " + client.users.size + " members.")
});
 
client.login(process.env.BOT_TOKEN);
