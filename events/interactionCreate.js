const client = require("../index");
const { ApplicationCommandOptionType, Events } = require("discord.js");
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
		const command = client.slashCommands.get(interaction.commandName)
		if (!command) return
		const args = {}
		for (let option of interaction.options.data) {
			if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
				if (option.name) args["SubcommandGroup"] = option.name
				option.options?.forEach((x) => {
					if (x.type === ApplicationCommandOptionType.Subcommand) {
						if (x.name) args["Subcommand"] = x.name
						x.options?.forEach((z) => {
							if (z.value !== undefined) {
								const { name, value } = z
								args[name] = value
							};
						});
					} else if (x.value !== undefined) {
						const { name, value } = x
						args[name] = value
					};
				});
			} else if (option.type === ApplicationCommandOptionType.Subcommand) {
				if (option.name) args["Subcommand"] = option.name
				option.options?.forEach((x) => {
					if (x.value !== undefined) {
						const { name, value } = x
						args[name] = value
					};
				});
			} else if (option.value !== undefined) {
				const { name, value } = option
				args[name] = value
			};
		}
		await command.run(client, interaction, args)
	}
})