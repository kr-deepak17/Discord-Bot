
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const Groq = require('groq-sdk');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Groq API integration
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Create command
    if (message.content.startsWith("create")) {
        const url = message.content.split("create")[1].trim();

        return message.reply({
            content: "Generating Short ID for " + url
        });
    }

    // Groq API integration;
    try {
        await message.channel.sendTyping();

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: message.content
                }
            ]
        });

        const answer = response.choices[0].message.content;

        await message.reply(answer.slice(0, 1900));

    } catch (error) {
        console.log("STATUS:", error.status);
        console.log("CODE:", error.code);
        console.log("MESSAGE:", error.message);

        await message.reply("AI response generate nahi ho paya!");
    }
});

client.login(process.env.DISCORD_TOKEN);
