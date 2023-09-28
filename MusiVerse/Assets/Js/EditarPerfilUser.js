const inputNomeDeUserMeuPerfil = document.getElementById('inputNomeDeUserMeuPerfil')
const inputLinkBackgroundMeuPerfil =document.getElementById('inputLinkBackgroundMeuPerfil')
const inputLinkPerfilMeuPerfil = document.getElementById('inputLinkPerfilMeuPerfil')
const btnRepetirBackground = document.getElementById('btnRepetirBackground')

function AbrirPopUpEditarPerfil(OqFazer) {
    if(OqFazer == 'Abrir') {
        if(currentUser.User.Personalizar.Background != undefined && currentUser.User.Personalizar.Background != null) {
            inputLinkBackgroundMeuPerfil.value = currentUser.User.Personalizar.Background
        }
        
        if(currentUser.User.Personalizar.FotoPerfil != undefined && currentUser.User.Personalizar.FotoPerfil != null) {
            inputLinkPerfilMeuPerfil.value = currentUser.User.Personalizar.FotoPerfil
        }
        
        try {
            btnRepetirBackground.checked = currentUser.User.Personalizar.RepetirBackGround
        } catch(e){console.warn(e)}

        document.getElementById('inputNomeDeUserMeuPerfil').value = currentUser.User.Nome
        document.getElementById('pop-upEditarPerfil').style.display = 'flex'
    } else {
        document.getElementById('pop-upEditarPerfil').style.display = 'none'
    }
}

function SalvarEdicao() {

    if(inputNomeDeUserMeuPerfil && inputLinkBackgroundMeuPerfil) {
        db.collection('Users').doc(currentUser.User.Id).update({Nome: inputNomeDeUserMeuPerfil.value}).then(() => {

            let BackgoundEmail

            if(currentUser.User.Personalizar.BackgroundPerfil) {
                BackgoundEmail = currentUser.User.Personalizar.BackgroundPerfil
            } else {
                BackgoundEmail = currentUser.User.Personalizar.BackgoundEmail
            }

            
            let NewPersonalizar = {
                Background: inputLinkBackgroundMeuPerfil.value,
                FotoPerfil: inputLinkPerfilMeuPerfil.value,
                BackgoundEmail,
                RepetirBackGround: btnRepetirBackground.checked
            }


            db.collection('Users').doc(currentUser.User.Id).update({Personalizar: NewPersonalizar}).then(() => {
                currentUser.User.Nome = inputNomeDeUserMeuPerfil.value
                currentUser.User.Personalizar = NewPersonalizar

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

                try {
                    if(document.getElementById('coainerBackgroundPerfil').style.backgroundImage != `url(Assets/Imgs/Banners/fitaCassete.avif)`) {
                        if(btnRepetirBackground.checked) {
                            document.getElementById('coainerBackgroundPerfil').classList.add('RepetirBackgroundPerfilUser')
                        } else {
                            document.getElementById('coainerBackgroundPerfil').classList.remove('RepetirBackgroundPerfilUser')
                        }
                    } else {
                        document.getElementById('coainerBackgroundPerfil').classList.add('RepetirBackgroundPerfilUser')
                    }
                } catch{}
            })
        })
    }
}