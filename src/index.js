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

// Helper function to get activity label
function getActivityLabel(activity) {
    switch (activity.type) {
        case 0: return "Playing";
        case 2: return "Listening to";
        case 3: return "Watching";
        case 5: return "Competing in";
        default: return "";
    }
}

app.get("/img/:userId", async (req, res) => {
    const userId = req.params.userId || "754359468275531906";
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILDID);
    const member = await guild.members.fetch({ user: userId, withPresences: true, force: true });

    const user = {
        username: member.user.globalName || member.user.username,
        avatar: member.user.displayAvatarURL({ extension: 'png', size: 4096 }),
        status: member.presence ? member.presence.status : "offline",
        customStatus: member.presence?.activities[0]?.state || null,
    };

    let activityDetails = null;
    if (member.presence && member.presence.activities.length > 0) {
        const activity = member.presence.activities.find(act => act.type === 0 || act.type === 2 || act.type === 3 || act.type === 5);
        if (activity) {
            const label = getActivityLabel(activity);
            activityDetails = activity.type === 2 
                ? `${label} ${activity.details} by ${activity.state}` 
                : `${label} ${activity.name}`;
        }
    }

    const statusColor = getStatusColor(user.status);

    // Render HTML content with conditional layout adjustments
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
                .info { margin-left: 20px; display: flex; flex-direction: column; justify-content: center; }
                .username {
                    font-size: 20px;
                    font-weight: bold;
                    margin: ${user.customStatus || activityDetails ? '0 0 8px 0' : '0'};
                    text-align: ${!user.customStatus && !activityDetails ? 'center' : 'left'};
                }
                .custom-status {
                    font-size: 16px;
                    color: #99aab5;
                    margin: 0;
                    display: ${user.customStatus ? 'block' : 'none'};
                }
                .activity {
                    font-size: 16px;
                    color: #99aab5;
                    margin-top: ${user.customStatus ? '4px' : '0'};
                    display: ${activityDetails ? 'block' : 'none'};
                }
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
                    <p class="custom-status">${user.customStatus || ''}</p>
                    <p class="activity">${activityDetails || ''}</p>
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
