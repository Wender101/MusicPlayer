const inputEmailUser = document.getElementById('inputEmailUser')
const inputSenhaUser = document.getElementById('inputSenhaUser')
const inputNomeUser = document.getElementById('inputNomeUser')
const btnLogin = document.getElementById('btnLogin')
const btnCadastro = document.getElementById('btnCadastro')
const containerNomeUser = document.getElementById('containerNomeUser')

function atualizarCadastro() {

    if(inputEmailUser.value.trim() != '' && inputSenhaUser.value.trim() != '') {
        btnLogin.style.background = '#0FF'
    } else {
        btnLogin.style.background = 'rgba(102, 102, 102, 0.13)'
    }
}

function FazerLogin() {
    firebase.auth().signInWithEmailAndPassword(inputEmailUser.value, inputSenhaUser.value).then(() => {
        alert('Usuario logado')

        setTimeout(() => {
            location.href = 'MusiVerse.html'
        }, 3000)
    })
}

function Cadastrar() {
    console.log(1111);
    containerNomeUser.style.display = 'block'

    if(inputNomeUser.value.trim() != '' && inputNomeUser.value.length > 0) {
        console.log(2222);
        auth.createUserWithEmailAndPassword(inputEmailUser.value, inputSenhaUser.value).then(user => {
            console.log('Usuario', user)

            const ContaUser = {
                Email: inputEmailUser.value,
                Nome: inputNomeUser.value,
                InfosPerfil: {
                    Seguidores: [],
                    Seguindo: [],
                    Amigos: [],
                },
                MusicasPostadas: [],
                MusicasCurtidas: [],
                GostoMusical: {
                    Autores: [],
                    Genero: [],
                    Playlists: []
                },
                Background: null,
                FotoPerfil: null
            }

            db.collection('Users').add(ContaUser).then(() => {
                setTimeout(() => {
                    location.href = 'MusiVerse.html'
                }, 3000)
            })

        }).catch(error => {
            console.log('Error: ', error)
        })
    }
}