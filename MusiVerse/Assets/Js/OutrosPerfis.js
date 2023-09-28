const btnSeguirPagPerfilOutroUser = document.getElementById('btnSeguirPagPerfilOutroUser')
let  infosUserPesquisado

function AbrirPerfilOutroUser(infosUser) {
    let seguindoEsseUser = false
    infosUserPesquisado = infosUser
    const PagPerfilOutroUser = document.getElementById('PagPerfilOutroUser')
    PagPerfilOutroUser.style.display = 'block'
    
    //? Vai colocar a img de perfil do user pesquisado e o background
    var imgTeste = new Image()
    imgTeste.src = infosUser.Background
    const Background = document.getElementById('headerPagPerfilOutroUser')
    imgTeste.onload = function() {
        Background.style.backgroundImage = `url(${infosUser.Background})`
    }
    imgTeste.onerror = function() {
        Background.style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
    }
    
    var imgTeste2 = new Image()
    imgTeste2.src = infosUser.Personalizar.FotoPerfil
    const FotoPerfil = document.getElementById('imPerfilOutroUser')
    imgTeste2.onload = function() {
        FotoPerfil.src = infosUser.Personalizar.FotoPerfil
    }
    imgTeste2.onerror = function() {
        // FotoPerfil.src = `Assets/Imgs/Banners/fitaCassete.avif`
        document.getElementById('headerPagPerfilOutroUser').style.alignItems = 'end'
        document.getElementById('containerHeaderPagPerfilOutroUser').style.height = '50%'
        document.getElementById('containerImgHeaderPagPerfilOutroUser').style.display = 'none'
        
    }
    
    //? Vai informar o nome do user pequisado
    const nomePagPerfilOutroUser = document.getElementById('nomePagPerfilOutroUser')
    
    nomePagPerfilOutroUser.innerText = infosUser.Nome
    
    //? Vai mostrar as músicas postadas pelo user
    document.getElementById('containerMusicasPagPerfilOutroUser').innerHTML = ''
    RetornarMusicasPostadasPeloUser(infosUser.Email, document.getElementById('containerMusicasPagPerfilOutroUser'))
    
    //? Vai checar se você segue o user ou se o user pesquisado é você
    btnSeguirPagPerfilOutroUser.style.display = 'block'
    for(let c = 0; c <= infosUser.InfosPerfil.Seguindo.length; c++) {
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
    let seguindoEsseUser = false
    let feito = false
    let contador = 0
    for(let c = 0; c <= currentUser.User.InfosPerfil.Seguindo.length; c++) {
        try {
            if(infosUserPesquisado.Email == currentUser.User.InfosPerfil.Seguindo[c] && infosUserPesquisado.Email != currentUser.User.Email && !feito) {
                feito = true
               seguindoEsseUser = true
               contador = c
            }
        } catch (error) {
            console.warn(error)
        }
    }

     //? Se está seguindo, vai remover da lista
     if(seguindoEsseUser) {
        currentUser.User.InfosPerfil.Seguindo.splice(contador, 1)
        seguindoEsseUser = false
        btnSeguirPagPerfilOutroUser.classList.remove('btnSeguindoUser')
        btnSeguirPagPerfilOutroUser.innerText = 'Seguir'
    } else {
        currentUser.User.InfosPerfil.Seguindo.push(infosUserPesquisado.Email)
        seguindoEsseUser = true
        btnSeguirPagPerfilOutroUser.classList.add('btnSeguindoUser')
        btnSeguirPagPerfilOutroUser.innerText = 'Seguindo'
    }
    db.collection('Users').doc(currentUser.User.Id).update({ InfosPerfil: currentUser.User.InfosPerfil })
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