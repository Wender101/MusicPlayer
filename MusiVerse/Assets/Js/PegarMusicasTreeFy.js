const firebaseConfigTreeFy = {
    apiKey: "AIzaSyAf64jnLWXDgb8HziVAbqDyHS5xMuupgo4",
    authDomain: "treefy-3e5ae.firebaseapp.com",
    projectId: "treefy-3e5ae",
    storageBucket: "treefy-3e5ae.appspot.com",
    messagingSenderId: "444736184889",
    appId: "1:444736184889:web:9e07e1a665a52b8230a3e8"
}

  // Initialize Firebase
const firebaseTreeFy = firebase.initializeApp(firebaseConfigTreeFy, 'TreeFy')
const dbTreeFY = firebaseTreeFy.firestore()

let arrayArroz = []
function PassarMusicas() {
    dbTreeFY.collection('TodasAsMusicas').get().then((snapshot) => {
        snapshot.docs.forEach(Musicas => {
            const TodasAsMusicas = Musicas.data()
            
            for(let c = 0; c < TodasAsMusicas.Musicas.length; c++) {
                if(TodasAsMusicas.Musicas[c].Tipo != 'Teste' && TodasAsMusicas.Musicas[c].Tipo != 'teste') {
                    let Letra = []

                    if(TodasAsMusicas.Musicas[c].Letra) {
                        Letra = TodasAsMusicas.Musicas[c].Letra
                    }

                    NovaMusica = {
                        Autor: TodasAsMusicas.Musicas[c].NomeAutor,
                        EmailUser: TodasAsMusicas.Musicas[c].EmailUser,
                        Genero: TodasAsMusicas.Musicas[c].Tipo,
                        Letra,
                        LinkAudio: TodasAsMusicas.Musicas[c].LinkAudio,
                        LinkImg: TodasAsMusicas.Musicas[c].LinkImgiMusica,
                        NomeMusica: TodasAsMusicas.Musicas[c].NomeMusica,
                    }

                    arrayArroz.push(NovaMusica)

                    db.collection('MusicasPostadas').doc().set(NovaMusica)
                }
            }
        })
    })
} //PassarMusicas()