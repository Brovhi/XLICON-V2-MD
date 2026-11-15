const axios = require('axios');

const OWNER_NAME = '👑 𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 👑';

module.exports = {
    name: 'instadl',
    aliases: ['insta', 'instagram', 'ig'],
    
    async execute(sock, m, args) {
        try {
            // React karein
            await m.react('📥');
            
            if (!args || !args.length) {
                return await m.reply(`📸 *INSTAGRAM DOWNLOADER*\n\nUsage: .ig <url>\nExample: .ig https://www.instagram.com/reel/xxxxx\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }
            
            const url = args[0];
            
            if (!url.includes('instagram.com')) {
                return await m.reply(`❌ Please provide a valid Instagram URL.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }
            
            await m.reply(`⏳ Fetching Instagram media...\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            
            let finalUrl = null;
            let isVideo = false;
            let captionText = 'Instagram Media';

            // 🟢 API 1: Siputzx
            try {
                const res1 = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`, { timeout: 30000 });
                if (res1.data?.status && res1.data?.data?.[0]?.url) {
                    finalUrl = res1.data.data[0].url;
                    isVideo = finalUrl.includes('.mp4') || res1.data.data[0].type === 'video';
                }
            } catch (e) {
                console.log('API 1 failed...');
            }

            // 🟢 API 2: BTCH (Fallback)
            if (!finalUrl) {
                try {
                    const res2 = await axios.get(`https://btch-downloader-api-green.vercel.app/api/download/instagram?url=${encodeURIComponent(url)}`, { timeout: 30000 });
                    if (res2.data?.success && res2.data?.normalized?.media?.[0]?.url) {
                        finalUrl = res2.data.normalized.media[0].url;
                        isVideo = res2.data.normalized.media[0].type === 'video';
                        captionText = res2.data.normalized.title || 'Instagram Media';
                    }
                } catch (e) {
                    console.log('API 2 failed...');
                }
            }

            if (!finalUrl) {
                return await m.reply(`❌ Failed to fetch media.\nLink might be private, invalid, or APIs are down.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }

            const finalCaption = `📸 *INSTAGRAM DOWNLOADER*\n\n` +
                                 `📝 *Caption:* ${captionText.substring(0, 100)}\n\n` +
                                 `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`;

            // 🛡️ DIRECT URL SENDING (Bina RAM use kiye, taake logout na ho)
            if (isVideo) {
                await sock.sendMessage(m.chat, { 
                    video: { url: finalUrl }, 
                    caption: finalCaption,
                    mimetype: 'video/mp4'
                }, { quoted: m });
            } else {
                await sock.sendMessage(m.chat, { 
                    image: { url: finalUrl }, 
                    caption: finalCaption
                }, { quoted: m });
            }
            
        } catch (err) {
            console.error('Instagram Error:', err);
            // Exact error aapko chat mein dikhayega
            await m.reply(`❌ *Error:* ${err.message}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        }
    }
};
