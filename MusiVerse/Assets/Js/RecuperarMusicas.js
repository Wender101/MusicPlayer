//? Vai colocar no perfil do user as músicas que ele postou
function recuperarMusicas(emailRecuperarMusicas) {
    let musicasRecuperadasComSucesso = false
    let todasAsMusicasDoUser = []

    //? Vai pegar as músicas
    db.collection('MusicasPostadas').get().then((snapshot) => {
        console.log('Chamada feita: Recuperar Músicas')

        snapshot.docs.forEach(Musicas => {
            const MusicasPostadas = Musicas.data()
            if(MusicasPostadas.EmailUser == emailRecuperarMusicas) {
                todasAsMusicasDoUser.push(Musicas.id)
            }
        })

        //? Vai atualizar o perfil do user com as músicas postadas por ele
        db.collection('Users').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(User => {
                if(User.doc.data().Email == emailRecuperarMusicas && musicasRecuperadasComSucesso == false) {
                    musicasRecuperadasComSucesso = true
                    db.collection('Users').doc(User.doc.id).update({MusicasPostadas: todasAsMusicasDoUser}).then(() => {
                        alert('Músicas recuperadas com sucesso!')
                    })
                }
            })
        })
    })
} //recuperarMusicas('w52993000@gmail.com')