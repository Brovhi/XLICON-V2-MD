const axios = require('axios');

const OWNER_NAME = '👑 𝐇𝐚𝐒𝐒𝐚𝐧 𝐁𝐫𝐎𝐯𝐇𝐢 👑';

module.exports = {
    name: 'instadl',
    aliases: ['insta', 'instagram', 'ig'],
    
    async execute(sock, m, args) {
        try {
            await m.react('📥');
            
            // Safe check for args
            args = args || [];
            
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
            let captionText = 'Instagram Media';

            // 🟢 API 1: BTCH Downloader (Very Reliable)
            try {
                const apiUrl1 = `https://btch-downloader-api-green.vercel.app/api/download/instagram?url=${encodeURIComponent(url)}`;
                const res1 = await axios.get(apiUrl1, { timeout: 15000 });
                
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
                    const apiUrl2 = `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`;
                    const res2 = await axios.get(apiUrl2, { timeout: 15000 });
                    
                    if (res2.data?.status && res2.data?.data?.[0]) {
                        finalUrl = res2.data.data[0].url;
                        isVideo = finalUrl.includes('.mp4') || res2.data.data[0].type === 'video';
                    }
                } catch (e) {
                    console.log('IG API 2 also failed.');
                }
            }

            // 🛑 Agar dono API fail ho jayein
            if (!finalUrl) {
                throw new Error('Failed to fetch media. Link might be private or APIs are down.');
            }

            const finalCaption = `📸 *INSTAGRAM DOWNLOADER*\n\n` +
                                 `📝 *Caption:* ${captionText.substring(0, 100)}\n\n` +
                                 `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`;

            // 🛡️ MEMORY SAFE SENDING (No Buffer, No Logout)
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
