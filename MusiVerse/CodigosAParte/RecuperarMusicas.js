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
    console.log(todasAsMusicasDoUser);
    db.collection('Users').get().then((snapshot) => {
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
    recuperarMusicas('danielentoni75@gmail.com')
}, 2000)