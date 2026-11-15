const axios = require('axios');

module.exports = {
    name: 'instadl',
    aliases: ['insta', 'instagram', 'ig'],
    
    async execute(sock, m, args) {
        try {
            // Chat ID nikalne ka safe tareeqa
            const chatId = m.chat || m.from || (m.key && m.key.remoteJid);
            
            if (!args || args.length === 0) {
                return await m.reply("📸 Usage: .ig <url>");
            }
            
            const url = args[0];
            if (!url.includes('instagram.com')) {
                return await m.reply("❌ Invalid Instagram URL.");
            }

            await m.reply("⏳ Downloading Instagram media...");

            let finalUrl = null;

            // API 1
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`, { timeout: 20000 });
                if (res.data && res.data.status && res.data.data && res.data.data[0]) {
                    finalUrl = res.data.data[0].url;
                }
            } catch(e) {
                console.log('API 1 failed');
            }

            // API 2 (Fallback)
            if (!finalUrl) {
                try {
                    const res = await axios.get(`https://btch-downloader-api-green.vercel.app/api/download/instagram?url=${encodeURIComponent(url)}`, { timeout: 20000 });
                    if (res.data && res.data.success && res.data.normalized && res.data.normalized.media) {
                        finalUrl = res.data.normalized.media[0].url;
                    }
                } catch(e) {
                    console.log('API 2 failed');
                }
            }

            if (!finalUrl) {
                return await m.reply("❌ Failed to fetch media. Link might be private.");
            }

            // Media ko RAM mein download kar rahe hain (taake error na aaye)
            const mediaRes = await axios.get(finalUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(mediaRes.data);

            // Bina 'quoted' ke send kar rahe hain taake crash na ho
            if (finalUrl.includes('.mp4') || finalUrl.includes('video')) {
                await sock.sendMessage(chatId, { 
                    video: buffer, 
                    caption: "📸 Downloaded by HaSSaN BrOvHi" 
                });
            } else {
                await sock.sendMessage(chatId, { 
                    image: buffer, 
                    caption: "📸 Downloaded by HaSSaN BrOvHi" 
                });
            }

        } catch (err) {
            console.log(err);
            await m.reply("❌ Error: " + err.message);
        }
    }
}
