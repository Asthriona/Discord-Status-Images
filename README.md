# Discord Status Image  
![](https://discord-status.asthriona.com/img/754359468275531906)
This repo is a small service to create images with your discord status.  
Many services already offer this, but I hate joining random discord servers, and the few ones who are "open sources" the code is often a mess
and not that open source, since you have to go through that mess of a project to get all the configs figured out, no documentation or half the project is closed. 
Here, no front/back-end only this, and the documentation below, so if you want to run it yourself, you can easly do it.   
This project require no database, or external services other than Discord.  
  
## Instalation:
### Requirement: 
  - A Discord guild (Server)
  - A Discord bot (application)
  - A Discord Account.
  - A server with nodeJS installed. (Or your computer if you want to test if first.)

### Instalation: 
I will assume you have [no knowlege whatsoever](https://www.youtube.com/watch?v=fFcyqHzyhoQ) so feel free to skip thing you already know. But i will also assume you have 
basic knowledge of Discord and already have an account, and a guild. if not just make a guild. it's easy, we talking about discord. 

First you will need to create a Discord bot. for this, go to your [Discord Developper Portal](https://discord.com/developers/applications) then, click the "new application" button.
![](https://cdn.asthriona.com/i/2024/01/firefox_240131_0738AM28130.png)
Fill up the form, and follow whatever Discord asks.  
  
Then click on "bot" and "reset token" if you have 2FA it will ask you for a code, it's normal, provide the code and copy the token. 
Also you will need some privileged intents. 
PRESENCE INTENTS is mandatory for the bot to work.
![](https://cdn.asthriona.com/i/2024/01/firefox_240131_0745AM55280.png)  

SAVE YOUR TOKEN! it will be shown once, then you wont be able to get it again, you WILL have to reset it, and if you are using this bot for another app, said add will break uppon reset.  
  
Go in the files and create a `.env` file.  
this file should look like this: 
```
DISCORD_TOKEN=YOUR_TOKEN_HERE
DISCORD_GUILDID=YOUR_GUILD_ID_HERE
PORT=3000
```
The Discord token is the token you got earlier, paste it right after the `=`  
The `DISCORD_GUILDID` is the id of your guild, you will need to add the bot to the guild so the bot can get the information about the member.
if someone what to have the image too, they will need to have access to the guild.  
Then the `PORT` is whatever port the web app runs on.  
if your server do not have any webserver the port can be 80.  
But for that I will let you do as you wish, we all have our own way of deploying our apps. 

Once the .env is set, you are ready to install all the packages needed.  
`npm i`
For the testing phase, you will need `nodemon` a package that restarts apps when it sees changes.
`npm i -g nodemon`
or for Linux as non-root user: 
`sudo npm i -g nodemon`
This step may take a bit of time, Discord is dependent on many packages and is pretty heavy.  
once done, you may run the app:  
`npm run dev`

the app is running on "http://localhost:3000/"  
to get your status image go to "http://localhost:3000/img/[YOUR ID]"
for me it would be: "http://localhost:3000/img/754359468275531906" 
![](https://cdn.asthriona.com/i/2024/01/WindowsTerminal_240131_0752AM26864.png)

That's it! You can now share it, set it as bio on Anilist, your GitHub profile, or wherever you want :)

## Contribute
You may contribute to this repo, by opening a PR or requests features by opening an issue.  
if you decide to contribute by opening a PR, please don't use TS or anything like that, keep it as pure JS.
Any other improvement should be OK!  

## Getting help:
I will give support only using GitHub, Not Twitter, Not Discord, not Emails. 
if you need help or find a bug, please open a new Issue.  
I will not add anyone as friend to give support. And this is not a [Stellar Corporation](https://github.com/Yukiko-Dev-Team) project. 
Please do not join their support server to request help for this project. Only Issue in here.  
Maybe at some point, the project will be added to the SC Bug tracker.  
  
## Helping me Personally. 
I am Makoto Kobayashi, Development is only a hobby at this point, I'm not doing it professionally anymore, so if you want to help me with a few spare bucks to keep projects like this alive, 
please consider [sponsoring me on Github](https://github.com/sponsors/Asthriona)!
It would be greatly appreciated!
[Sponsor Page](https://github.com/sponsors/Asthriona)
