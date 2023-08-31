const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const serviceAccount = require('./musiverse-e89c0-firebase-adminsdk-lan8j-d90c98ef11.json')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'musiverse-e89c0.appspot.com'
})

const bucket = admin.storage().bucket()
const ytdl = require('ytdl-core')
const axios = require('axios')

app.use(express.json())

//? Formatar textos
function formatarTexto(texto) {
  // Remove espaços antes e depois do texto
  texto = texto.trim()

  const wordsToRemove = ['vevo', '- Trim', '(Official Music Video)', '(Official Audio)']

  wordsToRemove.forEach(word => {
    const regex = new RegExp('\\b' + word + '\\b', 'ig')
    texto = texto.replace(regex, '')
  })

  // Separa as palavras nas letras maiúsculas e coloca espaço entre elas
  texto = texto.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Remove espaços extras que possam ter sido criados
  texto = texto.trim()

  // Coloca as iniciais em maiúsculas
  texto = texto.replace(/\b\w/g, (c) => c.toUpperCase())

  return texto
}

app.post('/getVideoInfo', async (req, res) => {
  try {
    const videoURL = req.body.videoURL
    const audioOptions = {
      filter: 'audioonly'
    }

    const thumbnailURL = await getVideoThumbnailURL(videoURL)
    
    const info = await ytdl.getInfo(videoURL)
    const videoTitle = info.player_response.videoDetails.title
    const channelName = info.player_response.videoDetails.author

    const uid = admin.firestore().collection('uids').doc().id
    const audioFilename = `${videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${channelName.replace(/[^a-zA-Z0-9]/g, '_')}_audio.mp3`
    const thumbnailFilename = `${videoTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${channelName.replace(/[^a-zA-Z0-9]/g, '_')}_thumbnail.jpg`

    const audioPath = `MusicasPostadas/${uid}/${audioFilename}`
    const thumbnailPath = `MusicasPostadas/${uid}/${thumbnailFilename}`

    downloadAudioToFirebase(videoURL, audioOptions, bucket, audioPath)
    downloadThumbnailToFirebase(thumbnailURL, bucket, thumbnailPath)

    const audioPublicUrl = `https://storage.googleapis.com/${bucket.name}/${audioPath}`
    const thumbnailPublicUrl = `https://storage.googleapis.com/${bucket.name}/${thumbnailPath}`

    const videoInfo = {
      videoTitle: formatarTexto(videoTitle),
      channelName: formatarTexto(channelName),
      audioUrl: audioPublicUrl,
      thumbnailUrl: thumbnailPublicUrl,
      uid: uid
    }

    res.json(videoInfo)
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter informações do vídeo' })
  }
})

function getVideoThumbnailURL(videoURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const info = await ytdl.getInfo(videoURL)
      resolve(info.player_response.videoDetails.thumbnail.thumbnails[0].url)
    } catch (err) {
      reject(err)
    }
  })
}

function downloadAudioToFirebase(videoURL, options, bucket, filename) {
  const audioStream = ytdl(videoURL, options)

  const upload = bucket.file(filename).createWriteStream({
    metadata: {
      contentType: 'audio/mpeg'
    },
    public: true
  })

  audioStream.pipe(upload)
    .on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
      console.log('Áudio enviado para o Firebase Storage com sucesso!')
      console.log('Link para acessar o áudio:', publicUrl)
    })
    .on('error', (err) => console.error('Erro ao enviar o áudio:', err))
}

function downloadThumbnailToFirebase(thumbnailURL, bucket, filename) {
  axios.get(thumbnailURL, { responseType: 'stream' })
    .then((response) => {
      const upload = bucket.file(filename).createWriteStream({
        metadata: {
          contentType: 'image/jpeg'
        },
        public: true
      })

      response.data.pipe(upload)
        .on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`
          console.log('Capa do vídeo enviada para o Firebase Storage com sucesso!')
          console.log('Link para acessar a capa:', publicUrl)
        })
        .on('error', (err) => console.error('Erro ao enviar a capa do vídeo:', err))
    })
    .catch((err) => {
      console.error('Erro ao baixar a capa do vídeo:', err)
    })
}

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
