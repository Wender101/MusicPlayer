const inputEmailUser = document.getElementById('inputEmailUser')
const inputSenhaUser = document.getElementById('inputSenhaUser')
const inputNomeUser = document.getElementById('inputNomeUser')
const inputChave = document.getElementById('inputChave')
const btnLogin = document.getElementById('btnLogin')
const btnCadastro = document.getElementById('btnCadastro')
const containerNomeUser = document.getElementById('containerNomeUser')
const containerChave = document.getElementById('containerChave')

function RandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16)  //gerador de cores aleatórias
}

function atualizarCadastro() {

    if(inputEmailUser.value.trim() != '' && inputSenhaUser.value.trim() != '') {
        btnLogin.style.background = '#0FF'
    } else {
        btnLogin.style.background = 'rgba(102, 102, 102, 0.13)'
    }
}

let LogarOuCadastrar = 'Logar'
function FazerLogin() {
    LogarOuCadastrar = 'Logar'
    firebase.auth().signInWithEmailAndPassword(inputEmailUser.value, inputSenhaUser.value).then(() => {
        location.href = 'MusiVerse.html'

    }).catch((error) => {
        if(error.code == 'auth/wrong-password') {
            alert('Senha errada, tente novamente com outra senha.')
        }
    })
}

function Cadastrar() {
    LogarOuCadastrar = 'Cadastrar'
    containerNomeUser.style.display = 'block'
    containerChave.style.display = 'block'

    if(inputNomeUser.value.trim() != '' && inputNomeUser.value.length > 0 && inputChave.value.trim() != '' && inputChave.value.length > 0) {
        document.getElementById('CarregamentoTela1').style.display = 'flex'
        auth.createUserWithEmailAndPassword(inputEmailUser.value, inputSenhaUser.value).then(user => {
            const ContaUser = {
                Email: inputEmailUser.value,
                Nome: inputNomeUser.value,
                InfosPerfil: {
                    Seguidores: [],
                    Seguindo: [],
                    Amigos: [],
                    ViewsSemanais: 0,
                },
                MusicasPostadas: [],
                MusicasCurtidas: [],
                GostoMusical: {
                    Autores: [],
                    Genero: [],
                    Playlists: [],
                    Historico: {
                        Autores: [],
                        Musicas: [
                            {
                                "Tempo": 277.781,
                                "Musica": "EHjfQawW1DSTTebceFSv"
                            },
                            {
                                "Tempo": 224.281,
                                "Musica": "8UeuGQVfBw8ePs6LxSRj"
                            },
                            {
                                "Musica": "IOcfSe3FIy8JlXCwKjca",
                                "Tempo": 236.321
                            },
                            {
                                "Musica": "PHH4xNwHdC7BNIJdfzlB",
                                "Tempo": 177.581
                            },
                            {
                                "Tempo": 277.781,
                                "Musica": "EHjfQawW1DSTTebceFSv"
                            },
                            {
                                "Tempo": 224.281,
                                "Musica": "8UeuGQVfBw8ePs6LxSRj"
                            },
                            {
                                "Musica": "IOcfSe3FIy8JlXCwKjca",
                                "Tempo": 236.321
                            },
                            {
                                "Tempo": 177.581,
                                "Musica": "PHH4xNwHdC7BNIJdfzlB"
                            },
                            {
                                "Musica": "EHjfQawW1DSTTebceFSv",
                                "Tempo": 277.781
                            },
                            {
                                "Musica": "8UeuGQVfBw8ePs6LxSRj",
                                "Tempo": 224.281
                            },
                            {
                                "Tempo": 236.321,
                                "Musica": "IOcfSe3FIy8JlXCwKjca"
                            },
                            {
                                "Tempo": 177.581,
                                "Musica": "PHH4xNwHdC7BNIJdfzlB"
                            },
                            {
                                "Musica": "lRDHFAnbQNUYIH74RG75",
                                "Tempo": 11.882773
                            },
                            {
                                "Tempo": 2.913585,
                                "Musica": "PHH4xNwHdC7BNIJdfzlB"
                            },
                            {
                                "Musica": "PHH4xNwHdC7BNIJdfzlB",
                                "Tempo": 5.875011
                            },
                            {
                                "Tempo": 164.789649,
                                "Musica": "8UeuGQVfBw8ePs6LxSRj"
                            },
                            {
                                "Tempo": 224.281,
                                "Musica": "8UeuGQVfBw8ePs6LxSRj"
                            },
                            {
                                "Musica": "8UeuGQVfBw8ePs6LxSRj",
                                "Tempo": 224.281
                            },
                            {
                                "Tempo": 160.462116,
                                "Musica": "k9Vn5s3UFcCXgYE6PVoy"
                            },
                            {
                                "Musica": "VhCkmrlShO65HbzzLKjh",
                                "Tempo": 123.544272
                            }
                        ],
                        Playlists: [],
                        Users: []
                    }
                },

                Personalizar: {
                    Background: null,
                    FotoPerfil: null,
                    BackgroundEmail: RandomColor()
                }
            }

            //? Vai deletar a chave de acesso
            db.collection('Chaves').get().then(snapshot => {
                snapshot.docs.forEach(ChavesAcesso => {
                    const Chaves = ChavesAcesso.data()
                    for(let c = 0; c <= Chaves.ChavesDeAcesso.length; c++) {
                        try {
                            if(Chaves.ChavesDeAcesso[c] == inputChave.value) {
                                let ArrayChavesDeAcesso = Chaves.ChavesDeAcesso
                                ArrayChavesDeAcesso.splice(c, 1)

                                db.collection('Chaves').doc(ChavesAcesso.id).update({ChavesDeAcesso: ArrayChavesDeAcesso}).then(() => {
                                    //? Vai salvar a conta do user
                                    db.collection('Users').add(ContaUser).then(() => {
                                        location.href = 'MusiVerse.html'
                                    }).catch((e) => {
                                        alert('Error ao tentar criar o user: ' + e)
                                    })
                                }).catch((e) => {
                                    alert('Error ao tentar criar o user: ' + e)
                                })
                            }
                        } catch{}
                    }
                })
            })

        }).catch(error => {
            console.warn('Error: ', error)
            
            if(error.code == 'auth/email-already-in-use') {
                alert('Email já cadastrado! Use outro Email ou faça login com essa conta.')
                document.getElementById('CarregamentoTela1').style.display = 'none'
            }
        })
    }
}

//? Vai fazer o ligin ao apertar o espaço
document.addEventListener('keypress', (e) => {
    if(e.code == 'Enter') {
        if(LogarOuCadastrar == 'Logar') {
            FazerLogin()
        } else if(LogarOuCadastrar == 'Cadastrar') {
            Cadastrar()
        }
    }
})