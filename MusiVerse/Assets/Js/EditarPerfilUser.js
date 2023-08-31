function AbrirPopUpEditarPerfil(OqFazer) {
    if(OqFazer == 'Abrir') {
        document.getElementById('inputLinkBackgroundMeuPerfil').value = currentUser.User.Background
        document.getElementById('inputNomeDeUserMeuPerfil').value = currentUser.User.Nome
        document.getElementById('pop-upEditarPerfil').style.display = 'flex'
    } else {
        document.getElementById('pop-upEditarPerfil').style.display = 'none'
    }
}

function SalvarEdicao() {
    const inputNomeDeUserMeuPerfil = document.getElementById('inputNomeDeUserMeuPerfil')
    const inputLinkBackgroundMeuPerfil =document.getElementById('inputLinkBackgroundMeuPerfil')

    if(inputNomeDeUserMeuPerfil && inputLinkBackgroundMeuPerfil) {
        db.collection('Users').doc(currentUser.User.Id).update({Nome: inputNomeDeUserMeuPerfil.value}).then(() => {
            db.collection('Users').doc(currentUser.User.Id).update({Background: inputLinkBackgroundMeuPerfil.value}).then(() => {
                currentUser.User.Nome = inputNomeDeUserMeuPerfil.value
                currentUser.User.Background = inputLinkBackgroundMeuPerfil.value

                document.getElementById('NomeUserMeuPerfil').innerText = inputNomeDeUserMeuPerfil.value


                //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
                var img = new Image()
                img.src = inputLinkBackgroundMeuPerfil.value
                img.onload = function() {
                    console.log('Imagem de fundo carregada com sucesso.')
                    document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(${inputLinkBackgroundMeuPerfil.value})`
                }
                img.onerror = function() {
                    alert('Algo deu errado com o link informado. Tente outro.')
                    document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
                }
                document.getElementById('pop-upEditarPerfil').style.display = 'none'
            })
        })
    }
}