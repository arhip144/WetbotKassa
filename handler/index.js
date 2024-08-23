const { glob } = require("glob");
const { Client } = require("discord.js")
require('dotenv').config()
const { ApplicationCommandType, Events } = require("discord.js");
/**
 * @param {Client} client
 */
module.exports = async (client) => {
    client.on(Events.ClientReady, async () => {
        // Slash Commands
        console.time(`Successfully loaded commands`)
        const slashCommands = glob.sync(`slash-commands/*.js`, {
            absolute: true
        })
        const arrayOfSlashCommands = [];
        slashCommands.map(async (value) => {
            const file = require(value);
            if (!file?.name) return;
            client.slashCommands.set(file.name, file);
            if ([ApplicationCommandType.Message, ApplicationCommandType.User].includes(file.type)) {
                delete file.description;
                delete file.options;
            }
            let newMap = Object.assign({}, file);
            arrayOfSlashCommands.push(newMap);
        });
        console.log(`Successfully loaded commands.`)
        // Events
        console.time("Successfully loaded events")
        const eventFiles = glob.sync(`events/*.js`, {
            absolute: true
        })
        eventFiles.map((value) => {
            require(value)
        });
        console.timeEnd("Successfully loaded events")
        await client.application.commands.set(arrayOfSlashCommands);
    });
};
