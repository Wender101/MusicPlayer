const btnSeguirPagPerfilOutroUser = document.getElementById('btnSeguirPagPerfilOutroUser')
let  infosUserPesquisado

function AbrirPerfilOutroUser(infosUser) {
    document.querySelector('body').style.overflow = 'hidden'
    document.getElementById('containerImgHeaderPagPerfilOutroUser').style.display = 'none'
    let seguindoEsseUser = false
    infosUserPesquisado = infosUser
    const PagPerfilOutroUser = document.getElementById('PagPerfilOutroUser')
    PagPerfilOutroUser.style.display = 'block'
    
    //? Vai colocar a img de perfil do user pesquisado e o background
    var imgTeste = new Image()
    imgTeste.src = infosUser.Personalizar.Background
    const Background = document.getElementById('headerPagPerfilOutroUser')
    imgTeste.onload = function() {
        Background.style.backgroundImage = `url(${infosUser.Personalizar.Background})`
    }
    imgTeste.onerror = function() {
        Background.style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
    }
    
    var imgTeste2 = new Image()
    imgTeste2.src = infosUser.Personalizar.FotoPerfil
    const FotoPerfil = document.getElementById('imgPerfilOutroUser')
    imgTeste2.onload = function() {
        FotoPerfil.src = infosUser.Personalizar.FotoPerfil
        document.getElementById('containerImgHeaderPagPerfilOutroUser').style.display = 'flex'
        document.getElementById('headerPagPerfilOutroUser').style.alignItems = 'center'
        document.getElementById('containerHeaderPagPerfilOutroUser').style.height = '80%'
        document.getElementById('parteTextoPagPerfilOutroUser').style.marginBottom = '0px'
    }
    imgTeste2.onerror = function() {
        // FotoPerfil.src = `Assets/Imgs/Banners/fitaCassete.avif`
        document.getElementById('headerPagPerfilOutroUser').style.alignItems = 'end'
        document.getElementById('containerHeaderPagPerfilOutroUser').style.height = '50%'
        document.getElementById('containerImgHeaderPagPerfilOutroUser').style.display = 'none'
        document.getElementById('parteTextoPagPerfilOutroUser').style.marginBottom = '40px'
    }

    try {
        if(Background.style.backgroundImage != `url(Assets/Imgs/Banners/fitaCassete.avif)`) {
            if(infosUser.Personalizar.RepetirBackGround || infosUser.Personalizar.RepetirBackGround == undefined) {
                Background.classList.add('RepetirBackgroundPerfilUser')
            } else {
                Background.classList.remove('RepetirBackgroundPerfilUser')
            }
        } else {
            Background.classList.add('RepetirBackgroundPerfilUser')
        }
    } catch(e){console.warn(e)}
    
    //? Vai informar o nome do user pequisado
    const nomePagPerfilOutroUser = document.getElementById('nomePagPerfilOutroUser')
    const spanViewsSemanais = document.getElementById('viewsSemanais')
    nomePagPerfilOutroUser.innerText = infosUser.Nome

    try {
        if(infosUser.InfosPerfil.ViewsSemanais.Views > 0) {
            spanViewsSemanais.style.display = 'block'
    
            if(infosUser.InfosPerfil.ViewsSemanais.Views == 1) {
                spanViewsSemanais.innerText = `${infosUser.InfosPerfil.ViewsSemanais.Views} ouvinte semanal`
            } else {
                spanViewsSemanais.innerText = `${infosUser.InfosPerfil.ViewsSemanais.Views} ouvintes semanais`
            }
        } else {
            spanViewsSemanais.style.display = 'none'
        }
    } catch (error) {
        spanViewsSemanais.style.display = 'none'
    }
    
    //? Vai mostrar as músicas postadas pelo user
    document.getElementById('containerMusicasPagPerfilOutroUser').innerHTML = ''
    RetornarMusicasPostadasPeloUser(infosUser.Email, document.getElementById('containerMusicasPagPerfilOutroUser'))
    
    //? Vai checar se você segue o user ou se o user pesquisado é você
    btnSeguirPagPerfilOutroUser.style.display = 'block'
    for(let c = 0; c <= currentUser.User.InfosPerfil.Seguindo.length; c++) {

        try {
            if(currentUser.User.InfosPerfil.Seguindo[c] == infosUser.Email) {
                seguindoEsseUser = true
                btnSeguirPagPerfilOutroUser.classList.add('btnSeguindoUser')
                btnSeguirPagPerfilOutroUser.innerText = 'Seguindo'
                
            } else if(infosUser.Email == currentUser.User.Email) {
                btnSeguirPagPerfilOutroUser.style.display = 'none'
            }
        } catch (error) {
            console.warn(error)
        }
    }
    
    if(!seguindoEsseUser) {
        btnSeguirPagPerfilOutroUser.classList.remove('btnSeguindoUser')
        btnSeguirPagPerfilOutroUser.innerText = 'Seguir'
    }
}

//? Vai seguir/ deixar de seguir
btnSeguirPagPerfilOutroUser.addEventListener('click', () => {
    let seguindoEsseUserBtn = false
    let feito = false
    let contador = 0
    for(let c = 0; c <= currentUser.User.InfosPerfil.Seguindo.length; c++) {
        try {
            if(infosUserPesquisado.Email == currentUser.User.InfosPerfil.Seguindo[c] && infosUserPesquisado.Email != currentUser.User.Email && !feito) {
                feito = true
               seguindoEsseUserBtn = true
               contador = c
            }
        } catch (error) {
            console.warn(error)
        }
    }

    let oqFazerComUser
     //? Se está seguindo, vai remover da lista
     if(seguindoEsseUserBtn) {
        currentUser.User.InfosPerfil.Seguindo.splice(contador, 1)
        seguindoEsseUserBtn = false
        btnSeguirPagPerfilOutroUser.classList.remove('btnSeguindoUser')
        btnSeguirPagPerfilOutroUser.innerText = 'Seguir'
        oqFazerComUser = 'Remover Dos Seguidores'

    } else {
        currentUser.User.InfosPerfil.Seguindo.push(infosUserPesquisado.Email)
        seguindoEsseUserBtn = true
        btnSeguirPagPerfilOutroUser.classList.add('btnSeguindoUser')
        btnSeguirPagPerfilOutroUser.innerText = 'Seguindo'
        oqFazerComUser = 'Adicionar Nos Seguidores'
    }
    db.collection('Users').doc(currentUser.User.Id).update({ InfosPerfil: currentUser.User.InfosPerfil }).then(() => {
        //? Vai salvar no perfil do user pequisado o novo seguidor
        let NovoSeguidorSalvo = false
        db.collection('Users').get().then((snapshot) => {
            snapshot.docs.forEach(Users => {

                if(Users.data().Email == infosUserPesquisado.Email && !NovoSeguidorSalvo) {
                    NovoSeguidorSalvo= true
                    const InfosPerfilUserPesquisado = Users.data().InfosPerfil
        
                    if(oqFazerComUser == 'Remover Dos Seguidores') {
                        for(let c = 0; c < InfosPerfilUserPesquisado.Seguidores.length; c++) {
                            if(InfosPerfilUserPesquisado.Seguidores[c] == currentUser.User.Email) {
                                InfosPerfilUserPesquisado.Seguidores.splice(c, 1)
                            }
                        }
                        
                    } else if(oqFazerComUser == 'Adicionar Nos Seguidores') {
                        InfosPerfilUserPesquisado.Seguidores.push(currentUser.User.Email)
                    }
                    
                    setTimeout(() => {
                        db.collection('Users').doc(Users.id).update({ InfosPerfil: InfosPerfilUserPesquisado })
                        carregarUserArtistasSeguidos()
                    }, 500)
                }
            })
        })
    })
})

//? Vai tocar as músicas do user pesquisado
//? Ao clicar no btn de play
const  darPlayPagPerfilOutroUser = document.getElementById('darPlayPagPerfilOutroUser')
darPlayPagPerfilOutroUser.addEventListener('click', () => {
    ListaProxMusica = {
        Musicas: arrayMusicasPostadasPeloUser,
        Numero: 0,
    }
    DarPlayMusica(arrayMusicasPostadasPeloUser[0], 0)
})

//? Vai mostrar no NavBar os usuários e Artistas que vc segue
function carregarUserArtistasSeguidos() {
    const localUserArtistaSeguido = document.getElementById('localUserArtistaSeguido')
    localUserArtistaSeguido.innerHTML = ''
    try {
       for(let i = 0; i < currentUser.User.InfosPerfil.Seguindo.length; i++) {
            for(let c = 0; c < TodosOsUsers.length; c++) {

                if(currentUser.User.InfosPerfil.Seguindo[i] == TodosOsUsers[c].User.Email) {

                    let li = document.createElement('li')
                    let img = document.createElement('img')
                    let div = document.createElement('div')
                    let p = document.createElement('p')
                    let span = document.createElement('span')

                        //? Vai colocar a img de perfil do user pesquisado
                    function carregarImagem(src, callback) {
                        var img = new Image()
                        img.onload = function() {
                            callback(img)
                        }
                        img.onerror = function() {
                            callback(null)
                        }
                        img.src = src
                    }
                    
                    // Pré-carregue as imagens
                    carregarImagem(TodosOsUsers[c].User.Personalizar.FotoPerfil, function(imgPerfil) {
                        carregarImagem(TodosOsUsers[c].User.Personalizar.Background, function(imgBackground) {
                        if (imgPerfil) {
                            img.src = imgPerfil.src
                        } else if (imgBackground) {
                            img.src = imgBackground.src
                        } else {
                            img.src = 'Assets/Imgs/Banners/fitaCassete.avif'
                        }
                        })
                    })

                    li.className = 'perfilSeguindoNavBar'
                    p.innerText = TodosOsUsers[c].User.Nome
                    span.innerText = 'Usuário'

                    div.appendChild(p)
                    div.appendChild(span)
                    li.appendChild(img)
                    li.appendChild(div)
                    localUserArtistaSeguido.appendChild(li)

                    li.addEventListener('click' , () => {
                        AbrirPerfilOutroUser(TodosOsUsers[c].User)
                    })
                    
                }
            }
       }
    } catch(error) {
        console.warn(error)
        setTimeout(() => {
            carregarUserArtistasSeguidos()
        }, 1000)
    }
}  carregarUserArtistasSeguidos()