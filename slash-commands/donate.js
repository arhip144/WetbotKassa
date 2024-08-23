const { ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../botconfig")
require('dotenv').config()
const uniqid = require('uniqid')
const axios = require('axios');
module.exports = {
    name: 'donate',
    nameLocalizations: {
        'ru': `донат`,
    },
    description: 'Make a donate',
    descriptionLocalizations: {
        'ru': `Сделать донат`
    },
    options: [
        {
            name: 'rub',
            nameLocalizations: {
                'ru': 'рубли'
            },
            description: 'Amount of russian rubbles',
            descriptionLocalizations: {
                'ru': `Количество руских рублей`
            },
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 100000,
            required: true
        }
    ],
    dmPermission: false,
    run: async (client, interaction, args) => {
        const payload = {
            amount: {
                value: args.rub,
                currency: "RUB"
            },
            description: `Донат с аккаунта ${interaction.user.id}`,
            receipt: {
                email: config.email,
                items: [{
                    description: `Донат`,
                    amount: {
                        value: args.rub,
                        currency: "RUB"
                    },
                    vat_code: 1,
                    quantity: 1,
                    measure: "piece",
                    payment_subject: "payment",
                    payment_mode: "full_payment",
                }],
            },
            metadata: {
                userID: interaction.user.id,
                key: process.env.wetbotApiKey
            },
            confirmation: {
                type: "redirect",
                return_url: "https://wetbot.space/invite"
            },
            capture: true,
            test: false
        }
        const query = {
            url: `https://api.yookassa.ru/v3/payments`,
            data: JSON.stringify(payload),
            method: 'post',
            auth: {
                username: config.shopId,
                password: process.env.yooKassaPrivateKey
            },
            headers: {
                'Idempotence-Key': uniqid.time(),
                'Content-Type': 'application/json'
            }
        }
        const response = await axios.request(query)
        if (response.data.status >= 400) {
            console.error(response.data.statusText)
            return interaction.editReply({ content: response.data.statusText, ephemeral: true })
        }
        const payment = response.data
        const content = `Ваша ссылка для оплаты на сумму ${payment.amount.value} ${payment.amount.currency}`
        const components = [
            new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(payment.confirmation.confirmation_url)
                        .setLabel(`ЗАДОНАТИТЬ ${args.rub} ${payment.amount.currency}`)
                ])
        ]
        return interaction.reply({ ephemeral: true, content, components })
    }
}