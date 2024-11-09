require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

// Helper function to get status color
function getStatusColor(status) {
    switch (status) {
        case 'online': return '#43b581'; // Green
        case 'idle': return '#faa61a'; // Yellow
        case 'dnd': return '#f04747'; // Red
        default: return '#747f8d'; // Gray for offline or unknown
    }
}

// Route to render the status card as HTML
app.get("/img/:userId", async (req, res) => {
    const userId = req.params.userId || "754359468275531906";
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILDID);
    const member = await guild.members.fetch({ user: userId, withPresences: true, force: true });

    const user = {
        username: member.user.globalName || member.user.username,
        avatar: member.user.displayAvatarURL({ extension: 'png', size: 4096 }),
        status: member.presence ? member.presence.status : "offline",
        customStatus: member.presence?.activities[0]?.state || "No custom status",
        spotifyActivity: member.presence?.activities[1] 
            ? `${member.presence.activities[1].details} - ${member.presence.activities[1].state}` 
            : "No Spotify activity",
    };

    // Get the color based on the status
    const statusColor = getStatusColor(user.status);

    // Render HTML content
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Discord Status Card</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #36393f; color: #ffffff; }
                .card { width: 450px; padding: 20px; background-color: #2c2f33; border-radius: 8px; display: flex; align-items: center; }
                .avatar-container { position: relative; }
                .avatar { width: 80px; height: 80px; border-radius: 50%; }
                .status-indicator {
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    width: 20px;
                    height: 20px;
                    background-color: ${statusColor};
                    border: 2px solid #2c2f33;
                    border-radius: 50%;
                }
                .info { margin-left: 20px; }
                .username { font-size: 20px; font-weight: bold; margin: 0; }
                .custom-status, .spotify-activity { font-size: 16px; color: #99aab5; margin: 4px 0 0 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="avatar-container">
                    <img src="${user.avatar}" alt="User Avatar" class="avatar">
                    <span class="status-indicator"></span>
                </div>
                <div class="info">
                    <p class="username">${user.username}</p>
                    <p class="custom-status">${user.customStatus}</p>
                    <p class="spotify-activity">${user.spotifyActivity}</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
