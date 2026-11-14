const { generateWAMessageFromContent, generateMessageID } = require('@adiwajshing/baileys')

const OWNER_NAME = '👑 𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 👑'
const BOT_NAME = '𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 𝐌𝐃'

module.exports = {
    name: 'menu2',
    description: 'Interactive menu with essential commands',
    aliases: ['test', 'menu2'],

    async execute(sock, m) {
        try {
            const prefix = global.BOT_PREFIX || '.';

            const msg = generateWAMessageFromContent(
                m.from,
                {
                    interactiveMessage: {
                        header: {
                            // 👇 XLICON ki jagah aapka bot ka naam
                            title: BOT_NAME 
                        },
                        body: {
                            text:
                                `Tap any button below to execute the command instantly:\n\n` +
                                `Current prefix: *${prefix}*\n\n` +
                                `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`
                        },
                        footer: {
                            // 👇 Footer change kar diya
                            text: `Powered by ${OWNER_NAME}`
                        },
                        contextInfo: {
                            stanzaId: m.key.id,
                            participant: m.sender,
                            quotedMessage: m.message
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Owner',
                                        id: `${prefix}owner`
                                    })
                                },
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Alive',
                                        id: `${prefix}alive`
                                    })
                                },
                                {
                                    name: 'quick_reply',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Uptime',
                                        id: `${prefix}uptime`
                                    })
                                },
                                {
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'More',
                                        sections: [
                                            {
                                                // 👇 Section title mein aapka naam
                                                title: BOT_NAME,
                                                rows: [
                                                    {
                                                        header: 'Ping',
                                                        title: 'Check Bot Ping',
                                                        id: `${prefix}ping`
                                                    },
                                                    {
                                                        header: 'Menu',
                                                        title: 'Show Full Menu',
                                                        id: `${prefix}menu`
                                                    }
                                                ]
                                            }
                                        ]
                                    })
                                }
                            ],
                            messageParamsJson: JSON.stringify({
                                bottom_sheet: {
                                    in_thread_buttons_limit: 2,
                                    divider_indices: [1],
                                    list_title: 'More Options',
                                    button_title: 'Click Here'
                                }
                            })
                        }
                    }
                },
                {
                    userJid: m.sender,
                    messageId: generateMessageID()
                }
            );

            await sock.relayMessage(
                m.from,
                msg.message,
                {
                    messageId: msg.key.id,
                    additionalNodes: [
                        {
                            tag: 'biz',
                            attrs: {},
                            content: [
                                {
                                    tag: 'interactive',
                                    attrs: {
                                        type: 'native_flow',
                                        v: '1'
                                    },
                                    content: [
                                        {
                                            tag: 'native_flow',
                                            attrs: {
                                                v: '9',
                                                name: 'mixed'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            );

            await sock.sendMessage(m.from, {
                react: {
                    text: '✅',
                    key: m.key
                }
            });

        } catch (error) {
            console.error('Menu2 plugin error:', error);
            await m.reply(`❌ Error: ${String(error.message || error)}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        }
    }
};
