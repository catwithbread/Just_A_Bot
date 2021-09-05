const fs = require('fs');
const config = require('./data/config.json');
const Client = require('./Structures/Client');
const Command = require('./Structures/Command.js');

const client = new Client();

fs.readdirSync('./src/commands').filter(file => file.endsWith('.js')).forEach(file => {

    /**
     * @type {Command}
     */
    const command = require(`./commands/${file}`);
    console.log(`Command ${command.name} loaded`);
    client.commands.set(command.name, command);

});

client.once('ready', () => {
    console.log('The bot is currently running');
});

client.on('messageCreate', message => {

    if(!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.substring(config.prefix.length).split(/ +/);

    const command = client.commands.find(cmd => cmd.name == args[0]);

    if(!command) return message.reply(`${args[0]} command does not exist!`);

    command.run(message, args, client);
    
})


client.login(config.token);
