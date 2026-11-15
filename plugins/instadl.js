const axios = require('axios');

const OWNER_NAME = '👑 𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 👑';

module.exports = {
    name: 'instadl',
    aliases: ['insta', 'instagram', 'ig'],
    
    async execute(sock, m, args) {
        // 🛡️ Safe Variable Extraction (Taake undefined ka error na aaye)
        const conn = sock.client || sock.conn || sock; 
        const chatId = m.chat || m.from || m.key?.remoteJid;
        const quotedMsg = m.quoted || m;

        // Safe reply function jo har bot base par kaam karega
        const reply = async (text) => {
            if (conn && conn.sendMessage && chatId) {
                await conn.sendMessage(chatId, { text }, { quoted: quotedMsg }).catch(() => {});
            } else if (m.reply) {
                await m.reply(text).catch(() => {});
            }
        };

        try {
            if (!conn || !chatId) return;
            
            // React
            if (conn.sendMessage) {
                await conn.sendMessage(chatId, { react: { text: '📥', key: m.key } }).catch(() => {});
            }
            
            args = args || [];
            if (!args.length) {
                return await reply(`📸 *INSTAGRAM DOWNLOADER*\n\nUsage: .ig <url>\nExample: .ig https://www.instagram.com/reel/xxxxx\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }
            
            const url = args[0];
            
            if (!url.includes('instagram.com')) {
                return await reply(`❌ Please provide a valid Instagram URL.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }
            
            await reply(`⏳ Downloading Instagram content...\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            
            let finalUrl = null;
            let isVideo = false;
            let captionText = 'Instagram Media';

            // 🟢 API 1: BTCH Downloader (Very Reliable)
            try {
                const res1 = await axios.get(`https://btch-downloader-api-green.vercel.app/api/download/instagram?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                if (res1.data?.success && res1.data?.normalized?.media?.[0]) {
                    finalUrl = res1.data.normalized.media[0].url;
                    isVideo = res1.data.normalized.media[0].type === 'video';
                    captionText = res1.data.normalized.title || 'Instagram Media';
                }
            } catch (e) {
                console.log('IG API 1 failed, trying API 2...');
            }

            // 🟢 API 2: Siputzx (Fallback)
            if (!finalUrl) {
                try {
                    const res2 = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                    if (res2.data?.status && res2.data?.data?.[0]) {
                        finalUrl = res2.data.data[0].url;
                        isVideo = finalUrl.includes('.mp4') || res2.data.data[0].type === 'video';
                    }
                } catch (e) {
                    console.log('IG API 2 also failed.');
                }
            }

            if (!finalUrl) {
                return await reply(`❌ Failed to fetch media. Link might be private or APIs are down.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }

            const finalCaption = `📸 *INSTAGRAM DOWNLOADER*\n\n` +
                                 `📝 *Caption:* ${captionText.substring(0, 100)}\n\n` +
                                 `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`;

            // 🛡️ MEMORY SAFE SENDING (Direct URL se bhejein taake logout na ho)
            if (conn.sendMessage) {
                if (isVideo) {
                    await conn.sendMessage(chatId, { 
                        video: { url: finalUrl }, 
                        caption: finalCaption,
                        mimetype: 'video/mp4'
                    }, { quoted: quotedMsg });
                } else {
                    await conn.sendMessage(chatId, { 
                        image: { url: finalUrl }, 
                        caption: finalCaption
                    }, { quoted: quotedMsg });
                }
            }
            
        } catch (err) {
            console.error('Instagram error:', err.message);
            await reply(`❌ *Error:* ${err.message}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        }
    }
};
