const axios = require('axios');

const OWNER_NAME = '👑 HaSSaN BrOvHi 👑';

module.exports = {
    name: 'quran',
    description: `Read Quran verses — By ${OWNER_NAME}`,
    aliases: ['quranpak', 'surah'],
    tags: ['islamic'],
    command: /^\.?(quran|quranpak|surah)$/i,

    async execute(sock, m, args) {
        try {
            // Agar user ne surah number nahi diya
            if (!args || args.length === 0) {
                return await m.reply(`📖 *QURAN PAK*\n\n*Usage:* .quran <surah_number>\n*Example:* .quran 1 (Surah Fatiha)\n*Example:* .quran 36 (Surah Yaseen)\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
            }

            const surahNumber = parseInt(args[0]);

            if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
                return await m.reply(`❌ *Invalid Surah Number!* Please provide a number between 1 and 114.`);
            }

            await m.reply(`⏳ Fetching Surah ${surahNumber}...\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);

            // API se Arabic, Urdu aur English translation fetch kar rahe hain
            const editions = 'quran-uthmani,ur.jalandhry,en.sahih';
            const apiUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${editions}`;
            
            const res = await axios.get(apiUrl, { timeout: 20000 });
            const json = res.data;

            if (json.code !== 200 || !json.data || json.data.length < 3) {
                throw new Error('Failed to fetch Quran data from API.');
            }

            const arabicData = json.data[0];
            const urduData = json.data[1];
            const englishData = json.data[2];

            const surahName = arabicData.englishName;
            const surahArabic = arabicData.name;
            const totalAyahs = arabicData.ayahs.length;

            let fullText = `📖 *Surah ${surahName}* (${surahArabic})\n`;
            fullText += `🔢 *Total Ayahs:* ${totalAyahs}\n`;
            fullText += `━━━━━━━━━━━━━━━━\n\n`;

            // Har ayat ko format kar rahe hain
            for (let i = 0; i < totalAyahs; i++) {
                fullText += `*Ayah ${i + 1}:*\n`;
                fullText += `📖 *Arabic:*\n${arabicData.ayahs[i].text}\n\n`;
                fullText += `🇵🇰 *Urdu:*\n${urduData.ayahs[i].text}\n\n`;
                fullText += `🇬🇧 *English:*\n${englishData.ayahs[i].text}\n\n`;
                fullText += `───────────────\n\n`;
            }

            fullText += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`;

            const chatId = m.chat || m.from || (m.key && m.key.remoteJid);

            // 🛡️ SMART SYSTEM: Agar text bohot lamba hai toh Document bhejein
            if (fullText.length > 4000) {
                const buffer = Buffer.from(fullText, 'utf-8');
                await sock.sendMessage(chatId, {
                    document: buffer,
                    mimetype: 'text/plain',
                    fileName: `Surah-${surahName}.txt`,
                    caption: `📖 *Surah ${surahName}*\n\n_Kyunki Surah lambi hai, isliye isko file ki shakal mein bheja gaya hai taake bot crash na ho._\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`
                }, { quoted: m });
            } else {
                // Agar choti surah hai toh direct text bhejein
                await sock.sendMessage(chatId, { text: fullText }, { quoted: m });
            }

        } catch (err) {
            console.error('Quran Error:', err.message);
            await m.reply(`❌ *Error:* Quran data fetch nahi ho saka. Please try again later.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`);
        }
    }
};
