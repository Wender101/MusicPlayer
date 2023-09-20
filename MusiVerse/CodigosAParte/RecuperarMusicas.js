//? Vai colocar no perfil do user as músicas que ele postou
function recuperarMusicas(emailRecuperarMusicas) {
    let musicasRecuperadasComSucesso = false
    let todasAsMusicasDoUser = []

    //? Vai pegar as músicas
    for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
        
        if(TodasMusicas.Musicas[c].EmailUser == emailRecuperarMusicas) {
            todasAsMusicasDoUser.push(TodasMusicas.Musicas[c].ID)
        }
    }

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
} setTimeout(() => {
    recuperarMusicas('endrel006san@gmail.com')
}, 2000)