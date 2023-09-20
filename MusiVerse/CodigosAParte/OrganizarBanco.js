let ArrayTodasAsMusicas = []
let musicasSet = new Set() // Usar um Set para evitar músicas repetidas
let TodasAsMusicasPostadas = []
function PassarMusicas() {
    db.collection('MusicasPostadas').get().then((snapshot) => {
        snapshot.docs.forEach(Musicas => {
            TodasAsMusicasPostadas.push(Musicas.data())
            
        })
    })

    setTimeout(() => {
        for (let c = 0; c < TodasAsMusicasPostadas.length; c++) {
            let Letra = []

            if (TodasAsMusicasPostadas[c].Letra) {
                Letra = TodasAsMusicasPostadas[c].Letra
            }

            NovaMusica = {
                Autor: TodasAsMusicasPostadas[c].Autor,
                EmailUser: TodasAsMusicasPostadas[c].EmailUser,
                Genero: TodasAsMusicasPostadas[c].Genero,
                Letra: TodasAsMusicasPostadas[c].Letra,
                LinkAudio: TodasAsMusicasPostadas[c].LinkAudio,
                LinkImg: TodasAsMusicasPostadas[c].LinkImg,
                NomeMusica: TodasAsMusicasPostadas[c].NomeMusica,
                ID: TodasAsMusicasPostadas[c].Id
            }

            // Verifica se a música já está no conjunto antes de adicioná-la
            const musicaString = JSON.stringify(NovaMusica)
            if (!musicasSet.has(musicaString)) {
                ArrayTodasAsMusicas.push(NovaMusica)
                musicasSet.add(musicaString)
            }
        }

        let Obj = {
            Musicas: ArrayTodasAsMusicas,
            Playlists: []
        }

        db.collection('InfoMusicas').doc().set(Obj)

        alert('Feito')
    }, 3000)
}

//PassarMusicas()