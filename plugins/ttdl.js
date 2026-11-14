const axios = require('axios');
const fs = require('fs');

// 👇 Aapki Branding
const OWNER_NAME = '👑 𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 👑';
const BOT_NAME = 'HaSSaN BrOvHi MD';

module.exports = {
    name: 'tiktok',
    description: 'Download TikTok videos without watermark',
    aliases: ['tt', 'tiktokdl', 'ttdl'],
    tags: ['downloader'],
    command: /^\.?(tiktok|tt|tiktokdl|ttdl)$/i,

    async execute(sock, m, args) {
        let filePath;
        try {
            if (!args.length) {
                return await m.reply(`ᴜsᴀɢᴇ: .ᴛɪᴋᴛᴏᴋ <ᴜʀʟ>\n\nᴇxᴀᴍᴘʟᴇ: .ᴛɪᴋᴛᴏᴋ https://www.tiktok.com/@scout2015/video/6718335390845095173\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }

            const url = args[0];

            if (!url.includes('tiktok.com')) {
                return await m.reply(`ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴛɪᴋᴛᴏᴋ ᴜʀʟ\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }

            await m.reply(`ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ...\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);

            const apiUrl = `https://api-abztech.zone.id/download/ttdnl?url=${encodeURIComponent(url)}`;

            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;

            if (!data || data.success !== true || data.type !== 'video' || !data.video) {
                return await m.reply(`ғᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ\nᴘʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }

            const videoUrl = data.video;

            const videoResponse = await axios.get(videoUrl, {
                responseType: 'arraybuffer',
                timeout: 60000,
                maxContentLength: 200 * 1024 * 1024,
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Origin': 'https://www.tikwm.com',
                    'Referer': 'https://www.tikwm.com/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const videoBuffer = Buffer.from(videoResponse.data);
            const fileName = `tiktok_${Date.now()}.mp4`;

            if (!fs.existsSync('./temp')) {
                fs.mkdirSync('./temp', { recursive: true });
            }

            filePath = `./temp/${fileName}`;
            fs.writeFileSync(filePath, videoBuffer);

            const stats = data.stats || {};
            const author = data.author || {};

            // 👇 Caption mein aapki branding add kar di hai
            const caption = `*ᴛɪᴋᴛᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n` +
                            `ᴛɪᴛʟᴇ: ${data.title || 'ɴᴏ ᴛɪᴛʟᴇ'}\n` +
                            `ᴅᴜʀᴀᴛɪᴏɴ: ${data.duration || 'ɴ/ᴀ'}s\n` +
                            `ᴠɪᴇᴡs: ${stats.play || 0}\n` +
                            `ʟɪᴋᴇs: ${stats.like || 0}\n` +
                            `ᴄᴏᴍᴍᴇɴᴛs: ${stats.comment || 0}\n` +
                            `sʜᴀʀᴇs: ${stats.share || 0}\n\n` +
                            `ᴀᴜᴛʜᴏʀ: ${author.nickname || 'ᴜɴᴋɴᴏᴡɴ'}\n` +
                            `@${author.username || ''}\n\n` +
                            `ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ ${OWNER_NAME}`;

            await sock.sendMessage(m.from, {
                video: fs.readFileSync(filePath),
                caption: caption,
                mimetype: 'video/mp4'
            });

        } catch (err) {
            console.error('TikTok Error:', err);
            await m.reply(`ᴇʀʀᴏʀ: ${err.message}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        } finally {
            if (filePath && fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (_) {}
            }
        }
    }
};
