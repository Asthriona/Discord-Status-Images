require("dotenv").config();
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const express = require("express");
const app = express();
const canvas = createCanvas(450, 100);
const ctx = canvas.getContext('2d');

// Function to draw a circular image
function drawCircularImage(image, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, radius * 2, radius * 2);
    ctx.restore();
}

// Function to draw a colored circle around the avatar
function drawColoredCircle(x, y, radius, color) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over'; // Set the compositing mode
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
}

// Function to draw the Discord Status card
async function generateDiscordStatusCard(user, req, res) {
    // Draw background
    ctx.fillStyle = '#36393f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load profile picture (placeholder)
    const avatar = await loadImage(user.avatar);

    // Draw colored circle around the avatar based on status
    let statusColor;
    switch (user.status) {
        case 'online':
            statusColor = '#43b581'; // Green for online
            break;
        case 'idle':
            statusColor = '#faa61a'; // Yellow for idle
            break;
        case 'dnd':
            statusColor = '#f04747'; // Red for Do Not Disturb
            break;
        default:
            statusColor = '#747f8d'; // Gray for other statuses
    }

    // Draw colored circle around the avatar
    drawColoredCircle(10, 10, 40, statusColor);

    // Draw circular profile picture
    const avatarRadius = 40;
    drawCircularImage(avatar, 10, 10, avatarRadius);


    // Draw user name
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(user.username, 105, 40);

    // Draw custom status
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#99aab5';
    ctx.fillText(`${user.customStatus}`, 105, 65);

    // Draw Spotify activity
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#99aab5';
    ctx.fillText(`${user.spotifyActivity}`, 105, 85);

    // Save the generated image to a file
    const fileName = 'discord_status_card.png';
    const buffer = canvas.toBuffer();
    // fs.writeFileSync(fileName, buffer);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(buffer, 'binary');
}

// Discord client 
const { Client, GatewayIntentBits } = require('discord.js');
// create client with intents for guild and user presences
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN)

app.get("/img/:userId", async (req, res) => {
    const userId = req.params.userId || "754359468275531906";
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILDID);
    const member = await guild.members.fetch({ user: userId || "754359468275531906", withPresences: true, force: true });
    if(!member.presence) {
        const user = {
            username: member.user.globalName || member.user.username,
            avatar: member.user.displayAvatarURL({ extension: 'png', size: 4096 }),
            status: "offline",
            customStatus: "Is offline.",
            spotifyActivity: "",
        }
        generateDiscordStatusCard(user, req, res)
    } else {
        const user = {
            username: member.user.globalName || member.user.username,
            avatar: member.user.displayAvatarURL({ extension: 'png', size: 4096 }),
            status: member.presence ? member.presence.status : "offline",
            customStatus: member.presence.activities[0] ? member.presence.activities[0].state || "No custom status" : "",
            spotifyActivity: member.presence.activities[1] ? `${member.presence.activities[1].details} - ${member.presence.activities[1].state}` || "No Spotify activity" : "",
        };
        generateDiscordStatusCard(user, req, res)
    }
});

// Test route
app.get("/test", async (req, res) => {
    const userId = "754359468275531906";
    const guild = await client.guilds.fetch("647689682381045772");
    const member = await guild.members.fetch({ user: userId || "754359468275531906", withPresences: true, force: true });
    const user = {
        username: member.user.username,
        avatar: member.user.displayAvatarURL({ extension: 'png', size: 4096 }),
        status: member.presence.status, // Replace with 'idle', 'dnd', or 'offline' to test different statuses
        customStatus: member.presence.activities[0].state || "No custom status",
        spotifyActivity: `${member.presence.activities[1].details} - ${member.presence.activities[1].state}` || "No Spotify activity",
    };
    res.json(user)
});

// ToDo Home page.

// Start the server

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

