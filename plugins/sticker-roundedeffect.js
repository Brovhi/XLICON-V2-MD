const sharp = require('sharp');
const { Image } = require('node-webpmux');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const OWNER_NAME = '👑 HaSSaN BrOvHi 👑';
const BOT_NAME = 'HaSSaN BrOvHi MD';

// 🛡️ Function to add your name in sticker Bio
async function addExif(webpBuffer, packName, authorName) {
    const img = new Image();
    await img.load(webpBuffer);
    
    const json = {
        "sticker-pack-id": crypto.randomBytes(32).toString('hex'),
        "sticker-pack-name": packName,
        "sticker-pack-publisher": authorName,
        "emojis": ["🖤"]
    };
    
    const exifAttr = Buffer.from([
        0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    
    img.exif = exif;
    return await img.save(null);
}

module.exports = {
    name: 'sticker',
    description: `Make sticker — By ${OWNER_NAME}`,
    aliases: ['s', 'stiker', 'sg'],
    tags: ['tools'],
    command: /^\.?(s|sticker|stiker|sg)$/i,
    
    async execute(sock, m, args) {
        try {
            const chatId = m.chat || m.from || (m.key && m.key.remoteJid);
            
            // Check agar reply kiya gaya hai aur wo media hai
            if (!m.quoted || !m.quoted.isMedia) {
                return await m.reply(`⚠️ *Reply to an image or short video with .s*`);
            }
            
            try { await m.react('⏳'); } catch(e) {}
            
            // Download media
            const buffer = await m.quoted.download();
            
            if (!buffer || buffer.length === 0) {
                return await m.reply(`❌ Failed to download media.`);
            }
            
            let webpBuffer;
            
            // 🎬 Agar video hai toh FFmpeg se convert karein
            if (m.quoted.type === 'videoMessage') {
                const tmpIn = path.join(os.tmpdir(), `stk_${Date.now()}.mp4`);
                const tmpOut = path.join(os.tmpdir(), `stk_${Date.now()}.webp`);
                
                fs.writeFileSync(tmpIn, buffer);
                
                await new Promise((resolve, reject) => {
                    exec(`ffmpeg -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=black@0.0" -vcodec libwebp -lossless 0 -q:v 60 -preset default -loop 0 -an -vsync 0 "${tmpOut}"`, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                
                webpBuffer = fs.readFileSync(tmpOut);
                
                try { fs.unlinkSync(tmpIn); } catch(e) {}
                try { fs.unlinkSync(tmpOut); } catch(e) {}
            } else {
                // 🖼️ Agar image hai toh Sharp se convert karein
                webpBuffer = await sharp(buffer)
                    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .webp({ quality: 70 })
                    .toBuffer();
            }
            
            // 👇 Add your name to sticker bio
            const finalBuffer = await addExif(webpBuffer, BOT_NAME, OWNER_NAME);
            
            // Send sticker
            await sock.sendMessage(chatId, { sticker: finalBuffer }, { quoted: m });
            
            try { await m.react('✅'); } catch(e) {}
            
        } catch (err) {
            console.error('Sticker error:', err);
            await m.reply(`❌ *Sticker error:* ${err.message}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        }
    }
};
