require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

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
    const avatarUrl = member.user.displayAvatarURL({ extension: 'png', size: 4096 });
    
    // Cache directory
    const cacheDir = './cache';
    const avatarPath = `${cacheDir}/${userId}.png`;
    
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }
    
    // Check if we have a cached version
    if (!fs.existsSync(avatarPath)) {
        // Download and cache the image
        const response = await fetch(avatarUrl);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(avatarPath, Buffer.from(buffer));
    }
    
    // Convert to base64 for inline embedding
    const imageBuffer = fs.readFileSync(avatarPath);
    const base64Image = imageBuffer.toString('base64');

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
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 120">
        <defs>
          <clipPath id="avatarClip">
            <circle cx="40" cy="40" r="40"/>
          </clipPath>
        </defs>
      
        <!-- Card background -->
        <rect width="450" height="120" rx="8" fill="#2c2f33"/>
        
        <!-- Avatar group - moved up by centering at y=20 -->
        <g transform="translate(20,20)">
          <!-- Avatar background and image -->
          <circle cx="40" cy="40" r="40" fill="#2c2f33"/>
          <image 
            x="0" 
            y="0" 
            width="80" 
            height="80" 
            clip-path="url(#avatarClip)"
            href="data:image/png;base64,${base64Image}"
          />
          
          <!-- Status indicator -->
          <circle 
            cx="70" 
            cy="70" 
            r="10" 
            fill="${statusColor}"
            stroke="#2c2f33" 
            stroke-width="2"
          />
        </g>
      
        <!-- Text content - adjusted y positions -->
        <g transform="translate(120,20)">
          <!-- Username -->
          <text 
            x="20" 
            y="35" 
            fill="#ffffff" 
            font-family="Arial, sans-serif" 
            font-size="20" 
            font-weight="bold"
          >${user.username}</text>
      
          <!-- Custom Status (if exists) -->
          ${user.customStatus ? `
          <text 
            x="20" 
            y="60" 
            fill="#99aab5" 
            font-family="Arial, sans-serif" 
            font-size="16"
          >${user.customStatus}</text>
          ` : ''}
      
          <!-- Activity (if exists) -->
          ${activityDetails ? `
          <text 
            x="20" 
            y="${user.customStatus ? '85' : '60'}" 
            fill="#99aab5" 
            font-family="Arial, sans-serif" 
            font-size="16"
          >${activityDetails}</text>
          ` : ''}
        </g>
      </svg>`)
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
