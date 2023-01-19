const { EmbedBuilder } = require("discord.js");
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const https = require("https");

const constantIDs = require("../constants/ids");
const youtubeConstants = require("../constants/youtube");
const { client, options } = require("../client");

function startVideoListener() {
    setInterval(()=>{checkForVideo()},1000*60*10);
}

async function checkForVideo() {
    /**
     * @type {{feed:{author:{name:string,uri:string},entry:[{'yt:videoId':string,title:string,link:{'@_href':string},published:string,updated:string,'media:group':{'media:title':string,'media:description':string}}]}}}
     */
    const data = await new Promise((resolve) => {
        https.get(
            `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeConstants.channelId}`,
            (res) => {
                let data = "";
                res.setEncoding("utf8");
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    resolve(
                        new XMLParser({ ignoreAttributes: false }).parse(data)
                    );
                });
            }
        );
    });

    data.feed.entry
        .filter(
            (video) =>
                Date.now() - new Date(video.published) < 1000 * 60 * 10
        )
        .reverse()
        .forEach(async (video) => {
            const embed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle(video.title)
                .setDescription(
                    "Pour voir la vidéo, il vous suffit de cliquer sur le titre"
                )
                .setURL(video.link["@_href"])
                .setImage(
                    `https://i2.ytimg.com/vi/${video["yt:videoId"]}/maxresdefault.jpg`
                )
                .setAuthor({
                    name: data.feed.author.name,
                    url: data.feed.author.uri,
                    iconURL: youtubeConstants.channelIcon,
                })
                .setTimestamp(new Date(video.published));

            const guild = client.guilds.cache.get(
                constantIDs.workingGuild[+options.test]
            );

            if (video.title.includes("#shorts")) {
                await guild.channels.cache
                    .get(constantIDs.channels.shortPost[+options.test])
                    .send({
                        content: `<@&${
                            constantIDs.roles.notifShorts[+options.test]
                        }> **Nouveau short !**`,
                        embeds: [embed],
                    });
            } else {
                await guild.channels.cache
                    .get(constantIDs.channels.youtubePost[+options.test])
                    .send({
                        content: `<@&${
                            constantIDs.roles.notifVideo[+options.test]
                        }> **Nouvelle vidéo !**`,
                        embeds: [embed],
                    });
            }
        });
}

module.exports = {startVideoListener};