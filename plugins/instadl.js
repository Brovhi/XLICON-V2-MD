const axios = require('axios');

// 👇 Aapki Branding
const OWNER_NAME = '👑 𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 👑';

module.exports = {
    name: 'instadl',
    aliases: ['insta', 'instagram', 'ig'],
    
    async execute(sock, m, args) {
        try {
            await m.react('📥');
            
            if (!args.length) {
                return m.reply(`📸 *INSTAGRAM DOWNLOADER*\n\nUsage: .ig <url>\nExample: .ig https://www.instagram.com/reel/xxxxx\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }
            
            const url = args[0];
            
            if (!url.includes('instagram.com')) {
                return m.reply(`❌ Please provide a valid Instagram URL.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }
            
            await m.reply(`⏳ Downloading Instagram content...\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            
            let finalUrl = null;
            let isVideo = false;
            let captionText = '';

            // 🟢 Try API 1 (Rebix)
            try {
                const apiUrl = `https://api-rebix.zone.id/api/igdl?quality=480&url=${encodeURIComponent(url)}`;
                const res = await axios.get(apiUrl, { timeout: 15000 });
                
                if (res.data && res.data.status && res.data.result) {
                    const result = res.data.result;
                    finalUrl = result.url[0];
                    isVideo = result.metadata.isVideo;
                    captionText = result.metadata.caption || 'No caption';
                }
            } catch (e) {
                console.log('API 1 failed, trying API 2...');
            }

            // 🟢 Fallback API 2 (Agar pehli fail ho jaye)
            if (!finalUrl) {
                try {
                    const apiUrl2 = `https://btch-downloader-api-green.vercel.app/api/download/instagram?url=${encodeURIComponent(url)}`;
                    const res2 = await axios.get(apiUrl2, { timeout: 15000 });
                    
                    if (res2.data && res2.data.success && res2.data.normalized && res2.data.normalized.media) {
                        finalUrl = res2.data.normalized.media[0].url;
                        isVideo = res2.data.normalized.media[0].type === 'video';
                        captionText = 'Downloaded from Instagram';
                    }
                } catch (e) {
                    console.log('API 2 also failed.');
                }
            }

            if (!finalUrl) {
                throw new Error('Failed to fetch media from Instagram. Link might be private or API is down.');
            }

            const finalCaption = `📸 *INSTAGRAM DOWNLOADER*\n\n` +
                                 `📝 *Caption:* ${captionText.substring(0, 100)}...\n\n` +
                                 `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`;

            // 🛡️ MEMORY SAFE: Buffer mein download nahi kar rahe, direct URL bhej rahe hain
            if (isVideo) {
                await sock.sendMessage(m.from, { 
                    video: { url: finalUrl }, 
                    caption: finalCaption,
                    mimetype: 'video/mp4'
                }, { quoted: m });
            } else {
                await sock.sendMessage(m.from, { 
                    image: { url: finalUrl }, 
                    caption: finalCaption
                }, { quoted: m });
            }
            
        } catch (err) {
            console.error('Instagram error:', err.message);
            await m.reply(`❌ *Error:* ${err.message}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        }
    }
};
