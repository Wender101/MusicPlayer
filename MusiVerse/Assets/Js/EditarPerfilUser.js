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

            let BackgroundEmail

            if(currentUser.User.Personalizar.BackgroundPerfil) {
                BackgroundEmail = currentUser.User.Personalizar.BackgroundPerfil
            } else {
                BackgroundEmail = currentUser.User.Personalizar.BackgroundEmail
            }

            
            let NewPersonalizar = {
                Background: inputLinkBackgroundMeuPerfil.value,
                FotoPerfil: inputLinkPerfilMeuPerfil.value,
                BackgroundEmail,
                RepetirBackGround: btnRepetirBackground.checked
            }


            db.collection('Users').doc(currentUser.User.Id).update({Personalizar: NewPersonalizar}).then(() => {
                currentUser.User.Nome = inputNomeDeUserMeuPerfil.value
                currentUser.User.Personalizar = NewPersonalizar

                for(let c = 0; c < TodosOsUsers.length; c++) {
                    if(TodosOsUsers[c].User.Email == currentUser.User.Email) {
                        TodosOsUsers[c].User.Personalizar = NewPersonalizar
                    }
                }

                document.getElementById('NomeUserMeuPerfil').innerText = inputNomeDeUserMeuPerfil.value


                //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
                var img = new Image()
                if(inputLinkBackgroundMeuPerfil.value.trim() != '') {
                    img.src = inputLinkBackgroundMeuPerfil.value
                    img.onload = function() {
                        document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(${inputLinkBackgroundMeuPerfil.value})`
                    }
                    img.onerror = function() {
                        alert('Algo deu errado com o link informado para a imagem de "fundo". Tente outro.')
                        document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
                    }
                }

                //? Vai checar se a img de perfil adionada está funcionando
                var imgTeste2 = new Image()
                if(inputLinkPerfilMeuPerfil.value.trim() != '') {
                    console.log('dentro do if??');
                    imgTeste2.src = inputLinkPerfilMeuPerfil.value
                    const FotoPerfil = document.getElementById('imgPerfilUserHeaderUser')
                    imgTeste2.onload = function() {
                        console.log('tudo certo por aqui');
                        FotoPerfil.src = inputLinkPerfilMeuPerfil.value
                        document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'block'
                        document.getElementById('coainerBackgroundPerfil').style.alignItems = 'center'
                        document.getElementById('coteudoHeaderPerfil').style.height = '80%'
                    }
                    imgTeste2.onerror = function() {
                        alert('Algo deu errado com o link informado para a imagem de "perfil". Tente outro.')
                        document.getElementById('coainerBackgroundPerfil').style.alignItems = 'end'
                        document.getElementById('coteudoHeaderPerfil').style.height = '50%'
                        document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'none'
                    } 
                } else {
                    document.getElementById('coainerBackgroundPerfil').style.alignItems = 'end'
                    document.getElementById('coteudoHeaderPerfil').style.height = '50%'
                    document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'none'
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