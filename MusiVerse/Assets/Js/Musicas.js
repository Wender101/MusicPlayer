const audioPlayer = document.querySelector('#audioPlayer')
const inputVolume = document.getElementById('inputVolume')
let audioNoMudo = false
let volumeAudioAtual = 0

//? Vai alterar o volume para o ultimo salvo
const ultimoVolumeSalvo = localStorage.getItem('VolumeMusiVerse')
if(ultimoVolumeSalvo) {
    volumeAudioAtual = parseInt(ultimoVolumeSalvo)
    inputVolume.value = parseInt(ultimoVolumeSalvo)
    volumeMusica(parseInt(ultimoVolumeSalvo))
}

function volumeMusica(volume = 0) {
    //? Vai mudar o volume de acordo com o input
    audioPlayer.volume = volume / 100

    if(volume > 0) {
        audioNoMudo = false
    }

    //? Vai salvar o volume do local Storage
    localStorage.setItem('VolumeMusiVerse', volume)
}

function mutarMusica() {
    //? Vai colocar/tirar o audio do mudo caso aperte o icone de volume
    if(audioNoMudo == false) {
        audioNoMudo = true
        volumeAudioAtual = inputVolume.value
        inputVolume.value = 0
    } else {
        audioNoMudo = false
        inputVolume.value = volumeAudioAtual
    }

    volumeMusica(inputVolume.value)
}

const TodasMusicas = []
function carregarMusicas() {
    let contador = 0

    return new Promise((resolve, reject) => {
        db.collection('MusicasPostadas').get().then((snapshot) => {
            console.log('Chamada feita')
    
            snapshot.docs.forEach(Musicas => {
                const MusicasPostadas = Musicas.data()
                TodasMusicas.push({
                    Musica: MusicasPostadas
                })

                TodasMusicas[contador].Musica.Id = Musicas.id

                if(TodasMusicas.length == snapshot.size) {
                    resolve()
                }

                contador++
            })
    
        })
    })
} carregarMusicas().then(() => {
    //# Vai execultar apenas depois que o banco for carregado

    //? Vai formatar os textos
    function formatarTexto(texto) {
        return texto.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '') //? Vai remover os acentos e espaços
    }

    async function RetornarMusicas(Pesquisa, Local, maxMusicas = 6, Estilo = 'Caixa', PesquisarEmail = false) {
        if(maxMusicas == 'Indeterminado') {
            maxMusicas = TodasMusicas.length
        }

        const article = document.createElement('article')
        article.className = 'containerMusicasOverflow'
        let contadorMusicasPorSection = 0
    
        let arraymusicasAleatorias = [...TodasMusicas]
        arraymusicasAleatorias.sort(() => Math.random() - 0.5)
    
        const PesquisaFormatada = formatarTexto(Pesquisa)
    
        let contadorMusicasLinha = 0
        for (let c = 0; c < TodasMusicas.length; c++) {
            const NomeMusica = formatarTexto(TodasMusicas[c].Musica.NomeMusica)
            const Autor = formatarTexto(TodasMusicas[c].Musica.Autor)
            const Genero = formatarTexto(TodasMusicas[c].Musica.Genero)
            let EmailUser = '&&&&&&&&&&&'

            if(PesquisarEmail) {
                EmailUser = formatarTexto(TodasMusicas[c].Musica.EmailUser)
            }
    
            let musicaPassou = false

            if (
                PesquisaFormatada.includes(NomeMusica) ||
                PesquisaFormatada.includes(Autor) ||
                PesquisaFormatada.includes(Genero) ||
                PesquisaFormatada.includes(EmailUser) ||
                NomeMusica.includes(PesquisaFormatada) ||
                Autor.includes(PesquisaFormatada) ||
                Genero.includes(PesquisaFormatada) ||
                EmailUser.includes(PesquisaFormatada)
            ) {
                musicaPassou = true
            } else if(Pesquisa == 'Aleatórias') {
                musicaPassou = true
            }

            if (musicaPassou && contadorMusicasPorSection < maxMusicas) {
                contadorMusicasPorSection++

                if(Estilo == 'Caixa') {
                    const div = document.createElement('div')
                    const containerImg = document.createElement('div')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const darPlay = document.createElement('div')
                    const p = document.createElement('p')
                    const span = document.createElement('span')
        
                    article.className = 'containerMusicaCaixa'
                    div.className = 'MusicasCaixa'
                    div.title = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.NomeMusica : TodasMusicas[c].Musica.NomeMusica
                    darPlay.className = 'BtnDarPlay'
                    darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`
                    // div.style.backgroundImage = `url(${'Aleatórias' ? arraymusicasAleatorias[c].Musica.LinkImg : TodasMusicas[c].Musica.LinkImg})`
                    containerImg.className = 'ContainerImgMusicaCaixa'
                    img.src = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.LinkImg : TodasMusicas[c].Musica.LinkImg
                    divTexto.className = 'TextoMusicaCaixa'
                    p.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.NomeMusica : TodasMusicas[c].Musica.NomeMusica
                    span.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.Autor : TodasMusicas[c].Musica.Autor
        
                    divTexto.appendChild(p)
                    divTexto.appendChild(span)
                    div.appendChild(darPlay)
                    containerImg.appendChild(img)
                    div.appendChild(containerImg)
                    div.appendChild(divTexto)
                    article.appendChild(div)

                    div.addEventListener('click', () => {
                        DarPlayMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica : TodasMusicas[c].Musica, c)
                    })

                } else if(Estilo == 'Linha') {
                    contadorMusicasLinha++
                    article.className = 'containerMusicaLinha'

                    const div = document.createElement('div')
                    const divPrimeiraParte = document.createElement('div')
                    const contador = document.createElement('p')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const Nome = document.createElement('p')
                    const AutorDaMusica = document.createElement('span')
                    const Genero = document.createElement('p')
                    const Heart = document.createElement('img')

                    div.className = 'MusicasLinha'
                    divTexto.className = 'TextoMusicaCaixa'
                    Heart.className = 'btnCurtirMeuPerfil'
                    img.className = 'ImgMusicaMeuPerfil'
                    Genero.className = 'GeneroMeuPerfil'

                    contador.innerText = contadorMusicasLinha
                    img.src = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.LinkImg : TodasMusicas[c].Musica.LinkImg
                    Nome.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.NomeMusica : TodasMusicas[c].Musica.NomeMusica
                    AutorDaMusica.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.Autor : TodasMusicas[c].Musica.Autor
                    Genero.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica.Genero : TodasMusicas[c].Musica.Genero
                    Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
                    
                    divTexto.appendChild(Nome)
                    divTexto.appendChild(AutorDaMusica)
                    divPrimeiraParte.appendChild(contador)
                    divPrimeiraParte.appendChild(img)
                    divPrimeiraParte.appendChild(divTexto)
                    div.appendChild(divPrimeiraParte)
                    div.appendChild(Genero)
                    div.appendChild(Heart)
                    article.appendChild(div)

                    div.addEventListener('click', () => {
                        DarPlayMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Musica : TodasMusicas[c].Musica, c)
                    })
                }
            }
        }
    
        const h1 = document.createElement('h1')
        const section = document.createElement('section')
    
        //? Vai adicionar o article no html apenas se houver algunma música
        if(article.innerHTML != '') {
            h1.innerText = Pesquisa === 'Aleatórias' ? 'Aleatórias' : Pesquisa
            section.className = 'containerMusica'
        
            if(Estilo != 'Linha') {
                section.appendChild(h1)
            }
            section.appendChild(article)
            Local.appendChild(section)
        }
    }

    async function RetornarPerfil(Pesquisa, Local) {

        //? ------------------------------------

        const PesquisaFormatada = formatarTexto(Pesquisa)
        const divContainer = document.createElement('div')
        const Perfil = document.createElement('div')
        Perfil.className = 'partePerfilPesquisa'
        const DarkOverlay = document.createElement('div')
        DarkOverlay.className = 'DarkOverlayPerfilPesquisar'
        const FotoPerfil = document.createElement('img')
        const NomeUserPesquisado = document.createElement('h1')
        const ContainerMusicas = document.createElement('div')
        ContainerMusicas.className = 'containermusicaPerfilPesquisa'

        //? ------------------------------------
        
        for(let c = 0; c < TodosOsUsers.length; c++) {
            const Nome = formatarTexto(TodosOsUsers[c].User.Nome)

            if(PesquisaFormatada.includes(Nome) || Nome.includes(PesquisaFormatada)) {
                
                //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
                var imgTeste = new Image()
                imgTeste.src = TodosOsUsers[c].User.Background
                imgTeste.onload = function() {
                    Perfil.style.backgroundImage = `url(${TodosOsUsers[c].User.Background})`
                }
                imgTeste.onerror = function() {
                    Perfil.style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
                }

                var imgTeste2 = new Image()
                imgTeste2.src = TodosOsUsers[c].User.FotoPerfil
                imgTeste2.onload = function() {
                    FotoPerfil.src = TodosOsUsers[c].User.FotoPerfil
                }
                imgTeste2.onerror = function() {
                    FotoPerfil.src = `Assets/Imgs/Banners/fitaCassete.avif`
                }

                NomeUserPesquisado.innerText = TodosOsUsers[c].User.Nome
                Perfil.appendChild(DarkOverlay)
                Perfil.appendChild(FotoPerfil)
                Perfil.appendChild(NomeUserPesquisado)
                divContainer.appendChild(Perfil)

                //? ---------------------------------------------------------------------------------

                for(let i = 0; i < TodasMusicas.length; i++) {

                    for(let contadorMusicasPostadas = 0; contadorMusicasPostadas < TodosOsUsers[c].User.MusicasPostadas.length; contadorMusicasPostadas++) {
                        if(TodasMusicas[i].Musica.Id == TodosOsUsers[c].User.MusicasPostadas[contadorMusicasPostadas]) {

                            const musica = document.createElement('div')
                            const divInfosMusica = document.createElement('div')
                            const img = document.createElement('img')
                            const NomeMusica = document.createElement('p')
                            const Autor = document.createElement('span')
                            const Heart = document.createElement('img')
                            const divTexto = document.createElement('div')

                            divContainer.className = 'containerPerfilPesquisa'
                            musica.className = 'musicasPerfilPesquisa'
                            divInfosMusica.className = 'divInfosMusicaPerfilPesquisa'
                            Heart.className = 'heartPerfilPesquisa'
                            divTexto.className = 'containerTextoPerfilPesquisa'

                            img.src = TodasMusicas[i].Musica.LinkImg
                            NomeMusica.innerText = TodasMusicas[i].Musica.NomeMusica
                            Autor.innerText = TodasMusicas[i].Musica.Autor
                            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'

                            divInfosMusica.appendChild(img)
                            divTexto.appendChild(NomeMusica)
                            divTexto.appendChild(Autor)
                            divInfosMusica.appendChild(divTexto)
                            musica.appendChild(divInfosMusica)
                            musica.appendChild(Heart)
                            ContainerMusicas.appendChild(musica)

                            musica.addEventListener('click', () => {
                                DarPlayMusica(TodasMusicas[i].Musica, i)
                            })
                        }
                    }
                }
            }
        }

        const h1 = document.createElement('h1')
    
        //? Vai adicionar o article no html apenas se houver algunma música
        h1.innerText = 'Melhor resultado'
        divContainer.appendChild(ContainerMusicas)

        if(ContainerMusicas.innerHTML != '') {
            Local.appendChild(h1)
            Local.appendChild(divContainer)
        }
    }
    
    async function MostrarMusicas() {
        try {
            const containerMain = document.getElementById('containerMain')

            await RetornarMusicas('Aleatórias', containerMain)
            await RetornarMusicas('Gospel', containerMain)
            await RetornarMusicas('Rock', containerMain)
            await RetornarMusicas('Country', containerMain)
            await RetornarMusicas('Phonk', containerMain)
        } catch (error) {
            console.error('Ocorreu um erro:', error)
        }
    }
    
    MostrarMusicas() 
    
    //? Vai pesquisar pelas músicas
    const inputPesquisa = document.getElementById('inputPesquisa')
    inputPesquisa.addEventListener('keypress', (e) => {
        if(e.keyCode == 13 && inputPesquisa.value.trim() != "") {
            document.querySelector('body').style.overflowY = 'hidden'
            document.getElementById('PagPesquisa').style.display = 'block'
            document.getElementById('containerResultadoPesquisa').innerHTML = ''

            //? Vai pesquisar por um perfil
            RetornarPerfil(inputPesquisa.value, document.getElementById('containerResultadoPesquisa'))

            //? Vai pesquisar por músicas
            RetornarMusicas(inputPesquisa.value, document.getElementById('containerResultadoPesquisa'), 'Indeterminado')

        }
    })

    //? Vai pegar as músicas postadas pelo user ao abrir o perfil
    const btnMeuPerfil = document.getElementById('btnMeuPerfil')
    btnMeuPerfil.addEventListener('click', () => {
        document.getElementById('NomeUserMeuPerfil').innerText = currentUser.User.Nome

        if(currentUser.User.Background != null && currentUser.User.Background.trim() != '') {
            //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
            var img = new Image()
            img.src = currentUser.User.Background
            img.onload = function() {
                document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(${currentUser.User.Background})`
            }
            img.onerror = function() {
                alert('Algo deu errado com img de background. Tente outra.')
                document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
            }

        } else {
            document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
        }

        document.getElementById('containerMusicasPerfilUser').innerHTML = ''
        RetornarMusicas(currentUser.InfoEmail.email, document.getElementById('containerMusicasPerfilUser'), 'Indeterminado', 'Linha', true)
    })
})

let trocouDeMusica = false
let fimMusica = false
let contadorMusicaTocando = 0
let isPlaying = false

//? Vai dar play naas músicas
function DarPlayMusica(Lista, num) {
    if(trocouDeMusica == false) {
        contadorMusicaTocando += num
        trocouDeMusica = true
        document.title = `${Lista.NomeMusica}`
        
        setTimeout(() => {
            fimMusica = false
            trocouDeMusica = false
        }, 1000)

        //? ----------------------------------------------------------

        document.getElementById('BarraMusica').style.bottom = '0px'
        PlayBtn = document.getElementById('PlayBtn')
        PlayBtn.src = `Assets/Imgs/Icons/Pause.png`

        //! Vai passar a música ou voltar usando os btns do teclado
        navigator.mediaSession.metadata = new MediaMetadata({
            title: Lista.NomeMusica,
            artist: Lista.Autor,
            album: '...',
            artwork: [
                { 
                    src: Lista.LinkImg, 
                    sizes: '300x300', 
                    type: 'image/png', 
                    purpose: 'cover', 
                    style: 'object-fit: cover'
                }
            ]
        })

        navigator.mediaSession.setActionHandler('nexttrack', function() {
            // atualizarTimeMusica('next', cloneMusicasSequencia)
        })

        navigator.mediaSession.setActionHandler('previoustrack', function() {
            // atualizarTimeMusica('back', cloneMusicasSequencia)
        })

        audioPlayer.src = Lista.LinkAudio

        audioPlayer.addEventListener('canplaythrough', function() {
            audioPlayer.play()

            //? Vai mudar a informações na barra música
            document.getElementById('imgMusicaBarraMusica').src = Lista.LinkImg
            document.getElementById('NomeMusicaBarraMusica').innerText = Lista.NomeMusica
            document.getElementById('AutorMusicaBarraMusica').innerText = Lista.Autor

            //? Vai atualizar a barra de progresso da música
            let progressoMusicaBarraMusica = document.getElementById('progressoMusicaBarraMusica')

            audioPlayer.addEventListener('timeupdate', function() {
                const percentProgress = (audioPlayer.currentTime / audioPlayer.duration) * 100
                progressoMusicaBarraMusica.value = percentProgress
            })
        
            progressoMusicaBarraMusica.addEventListener('input', function() {
                const newTime = (progressoMusicaBarraMusica.value / 100) * audioPlayer.duration
                audioPlayer.currentTime = newTime
            })
        })

        audioPlayer.addEventListener('pause', function() {
            isPlaying = false
            PlayBtn.src = `Assets/Imgs/Icons/Play.png`
            document.title = `Musi ._. Verse`
        })
    
        audioPlayer.addEventListener('play', function() {
            isPlaying = true
            PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
            document.title = `${Lista.NomeMusica}`
        })

        // //? Ao acabar a música
        audioPlayer.addEventListener('ended', function() {
            if(fimMusica == false) {
                fimMusica = true

                if(contadorMusicaTocando + 1 < TodasMusicas.length) {
                    contadorMusicaTocando += 1
                } else {
                    contadorMusicaTocando = 0
                }

                setTimeout(() => {
                    DarPlayMusica(TodasMusicas[contadorMusicaTocando].Musica, contadorMusicaTocando)
                }, 1000)
            }
        })
    }
}

//? Vai pausar a música
PlayBtn.addEventListener('click', function() {
    if(isPlaying == true) {
        document.title = `Musi ._. Verse`
        isPlaying = false
        PlayBtn.src = `Assets/Imgs/Icons/Play.png`
        audioPlayer.pause()

    } else {
        isPlaying = true
        PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
        audioPlayer.play()
        document.title = `${Lista.NomeMusica}`
    }
})

// //? Vai pular a música
// const NextBtn = document.getElementById('NextBtn')
// NextBtn.addEventListener("click", () => {
//     if(contadorMusicaTocando + 1 < TodasMusicas.length) {
//         contadorMusicaTocando =  contadorMusicaTocando  + 1
//     } else {
//         contadorMusicaTocando = 0
//     }

//     DarPlayMusica(TodasMusicas[contadorMusicaTocando].Musica, contadorMusicaTocando)
// })

// //? Vai voltar para a música anterior
// const BackBtn = document.getElementById('BackBtn')
// BackBtn.addEventListener("click", () => {
//     if(contadorMusicaTocando > 0) {
//         contadorMusicaTocando = contadorMusicaTocando - 1
//     } else {
//         contadorMusicaTocando = TodasMusicas.length
//     }

//     DarPlayMusica(TodasMusicas[contadorMusicaTocando].Musica, contadorMusicaTocando)
// })