const {
  sticker,
  webpToMp4,
  addExif,
  bot,
  addAudioMetaData,
  circleSticker,
} = require('../lib/')

// 👇 Yahan aapka Naam aur Bot ka Naam set hai
const OWNER_NAME = '👑 HaSSaN BrOvHi 👑'
const BOT_NAME = 'HaSSaN BrOvHi MD'

// 🩹 1. Normal Sticker Command
bot(
  {
    pattern: 'sticker',
    desc: `Make a sticker — By ${OWNER_NAME}`,
    type: 'sticker',
  },
  async (message) => {
    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.image)) {
      return await message.send(`⚠️ Reply to an image or video to make a sticker.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`)
    }

    const mediaPath = await message.reply_message.downloadAndSaveMediaMessage('sticker')
    const type = message.reply_message.image ? 1 : 2
    
    // 'str' ki jagah BOT_NAME pass kiya hai
    const stickerData = await sticker(BOT_NAME, mediaPath, type, message.id)

    return await message.send(
      stickerData,
      { 
        isAnimated: !!message.reply_message.video, 
        quoted: message.quoted,
        packname: BOT_NAME, // 👈 Force Packname
        author: OWNER_NAME   // 👈 Force Author
      },
      'sticker'
    )
  }
)

// ⭕ 2. Circle Sticker Command
bot(
  {
    pattern: 'circle',
    desc: `Make a circle sticker — By ${OWNER_NAME}`,
    type: 'sticker',
  },
  async (message) => {
    if (!message.reply_message || !message.reply_message.image) {
      return await message.send(`⚠️ Reply to an image to make a circle sticker.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`)
    }

    const mediaPath = await message.reply_message.downloadAndSaveMediaMessage('circleSticker')
    const circleData = await circleSticker(mediaPath, message.reply_message.video, message.id)

    return await message.send(circleData, { 
        isAnimated: false, 
        quoted: message.quoted,
        packname: BOT_NAME, // 👈 Force Packname
        author: OWNER_NAME   // 👈 Force Author
    }, 'sticker')
  }
)

// ✍️ 3. Take Command (Sticker ka naam badalna)
bot(
  {
    pattern: 'take ?(.*)',
    desc: `Change sticker pack name — By ${OWNER_NAME}`,
    type: 'sticker',
  },
  async (message, match) => {
    if (!message.reply_message || (!message.reply_message.sticker && !message.reply_message.audio)) {
      return await message.send(`⚠️ Reply to a sticker or audio to change its metadata.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`)
    }

    if (message.reply_message.sticker) {
      const media = await message.reply_message.downloadMediaMessage('mp4')
      
      // Agar user ne kuch custom naam nahi diya, toh by-default aapka naam use hoga
      const packData = match ? match : `${BOT_NAME}, ${OWNER_NAME}`
      
      return await message.send(
        await addExif(media, packData, message.id),
        { quoted: message.quoted },
        'sticker'
      )
    }

    if (!match) {
      return await message.send(`⚠️ Usage: .take Title, Artist\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`)
    }

    const [title, artists, url] = match.split(',')
    const audioData = await addAudioMetaData(
      await message.reply_message.downloadMediaMessage(),
      title,
      artists,
      '',
      url
    )

    return await message.send(
      audioData,
      { quoted: message.quoted, mimetype: 'audio/mpeg' },
      'audio'
    )
  }
)

// 🎬 4. MP4 Command (Sticker ko video banane ke liye)
bot(
  {
    pattern: 'mp4',
    desc: `Convert animated sticker to video — By ${OWNER_NAME}`,
    type: 'sticker',
  },
  async (message) => {
    if (
      !message.reply_message ||
      !message.reply_message.sticker ||
      !message.reply_message.animated
    ) {
      return await message.send(`⚠️ Reply to an animated sticker to convert it to video.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${OWNER_NAME}`)
    }

    const mediaPath = await message.reply_message.downloadAndSaveMediaMessage('sticker')
    const videoUrl = await webpToMp4(mediaPath)

    return await message.sendFromUrl(videoUrl)
  }
)
