require('dotenv').config(); // Load environment variables from .env file

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// Retrieve the bot token from environment variables
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('Discord token not found in environment variables.');
    process.exit(1);
}

// Extract and decode clientId from the token
const encodedClientId = token.split('.')[0];
const clientId = Buffer.from(encodedClientId, 'base64').toString();

const client = new Client({
    intents: [GatewayIntentBits.Guilds], // Correct intent for slash commands
});

// Define the slash command
const commands = [
    {
        name: 'linux',
        description: 'Explains the GNU/Linux distinction',
    },
];

// Register the slash command globally
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Registering global slash commands...');
        await rest.put(
            Routes.applicationCommands(clientId), // Register commands globally
            { body: commands },
        );
        console.log('Global slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
})();

// Handle interactions
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'linux') {
        await interaction.reply("I'd like to interject for a moment. What you're referring to as Linux, is in fact, GNU/Linux.");
    }
});

// Log in the bot
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);
