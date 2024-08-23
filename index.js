require('dotenv').config()
const express = require('express')
const app = express()
const http = require("http")
const https = require("https")
const axios = require('axios');
const config = require("./botconfig")
const localtunnel = require('localtunnel')
const { Client, GatewayIntentBits, Options, Events, Collection } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ],
    sweepers: { 
        ...Options.DefaultSweeperSettings,
        messages: { interval: 3600, lifetime: 86400 }, 
    },
    makeCache: Options.cacheWithLimits({ ...Options.DefaultMakeCacheSettings, MessageManager: 100 })
});
client.slashCommands = new Collection();
module.exports = client;
require("./handler")(client);
client.login(process.env.discordToken);

client.rest.on("rateLimited", error => {
    console.error(error)
})
process.on(`unhandledRejection`, error => {
    console.error(error);
});
process.on("uncaughtException", (error) => {
    console.error(error);
})
client.on(Events.Warn, console.log);

if (!config.hasWhiteIp) {
    (async () => {
        const tunnel = await localtunnel({ port: 80, subdomain: config.websiteName?.length ? config.websiteName.toLowerCase() : undefined });
        console.log(`Ваш URL: ${tunnel.url}`)
        tunnel.on('close', () => {
            console.log(`Туннель закрыт`)
        });
    })();
    http.createServer(app).listen(80)
} else {
    https.createServer({
        key: config.key,
        cert: config.sert,
        ca: config.ca?.length ? config.ca : undefined,
    }, app).listen(443);
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', async (req, res) => {
    return res.send({ code: 200, message: "Website works" })
})
app.post('/donate', async (req, res) => {
    if (req.body.event === "payment.succeeded") {
        if (!req.body.object) return res.status(400).send({ code: 400 }).end()
        const payment = req.body.object
        const donateAmount = +payment.amount.value
        if (!payment.metadata || !payment.metadata.userID) return res.status(400).send({ code: 400 }).end()
        if (!payment.metadata.key) return res.status(401).send({ code: 401 }).end()
        if (payment.metadata.key !== process.env.wetbotApiKey) return res.status(401).send({ code: 401 }).end()
        res.status(200).send({ code: 200 }).end()
        const guild = client.guilds.cache.get(config.serverId)
        if (!guild) return
        const member = await guild.members.fetch(payment.metadata.userID).catch(e => null)
        if (!member) return
        if (config.currencyPerRubble) {
            const response = await axios({
                url: `https://www.wetbot.space/api/guilds/${guild.id}/users/${member.user.id}`,
                method: "patch",
                data: {
                    currency: donateAmount * config.currencyPerRubble,
                },
                headers: {
                    Authorization: process.env.wetbotApiKey
                }
            })
            if (response.status === 200) console.log(`Выдано ${donateAmount * config.currencyPerRubble} валюты пользователю ${member.user.id}`)
            else console.error(response)    
        }
        if (config.giveItems && config.items?.length) {
            const items = config.items.map(e => {
                e.amount = e.amount * donateAmount
                return e
            })
            const response = await axios({
                url: `https://www.wetbot.space/api/guilds/${guild.id}/users/${member.user.id}/inventory`,
                method: "post",
                data: {
                    items
                },
                headers: {
                    Authorization: process.env.wetbotApiKey
                }
            })
            if (response.status === 200) console.log(`Выдан предмет ${items.map(e => `${e.itemID} (${e.amount})`).join(", ")} пользователю ${member.user.id}`)
            else console.error(response)
        }
        return
    }
})