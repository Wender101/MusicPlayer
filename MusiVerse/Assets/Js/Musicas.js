//? Vai formatar os textos
function formatarTexto(texto) {
    return texto.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '') //? Vai remover os acentos e espaços
}

const audioPlayer = document.querySelector('#audioPlayer')
const inputVolume = document.getElementById('inputVolume')
let audioNoMudo = false
let volumeAudioAtual = 0
let ListaProxMusica = {}

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

let TodasMusicas = []
let arraymusicasAleatorias = []
function carregarMusicas() {
    return new Promise((resolve, reject) => {
        db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
            snapshot.docs.forEach(Musicas => {
                TodasMusicas = Musicas.data()
                resolve()
            })
    
        }).catch((e) => {
            console.warn(e)
            location.href = `Error.html`
        })
    })
} carregarMusicas().then(() => {
    //# Vai execultar apenas depois que o banco for carregado
    //? Vai carregar as músicas na tela Home
    async function MostrarMusicas() {
        try {
            const containerMain = document.getElementById('containerMain')

            await RetornarMusicas('Aleatórias', containerMain)

            // for(let c = 0; c < arraymusicasAleatorias.length; c++) {
            //     try {
            //         document.getElementsByClassName('imgMusicasAleatoriasBanner')[c].src = arraymusicasAleatorias[c + 7].LinkImg
            //     } catch(e){console.warn(e)}
            // }

            // await RetornarMusicas('Gospel', containerMain)
            // await RetornarMusicas('Rock', containerMain)
            // await RetornarMusicas('Country', containerMain)
            // await RetornarMusicas('Phonk', containerMain)
        } catch (error) {
            console.error('Ocorreu um erro:', error)
        }
    } MostrarMusicas() 

    //? Vai fechar a tela de carregamento
    try {
        document.getElementById('CarregamentoTela1').style.display = 'none'
    } catch{}
}).catch((e) => {
    console.warn(e)
})

//? Tirar dps
setTimeout(() => {
    document.getElementById('CarregamentoTela1').style.display = 'none'
}, 5000)

async function RetornarMusicas(Pesquisa, Local, maxMusicas = 5, Estilo = 'Caixa', PesquisarEmail = false, Artista = false, ClassArticle) {
    if(maxMusicas == 'Indeterminado') {
        maxMusicas = TodasMusicas.Musicas.length
    }

    const article = document.createElement('article')

    if(ClassArticle) {
        console.log(ClassArticle);
        article.classList.add('containerMusicaCaixa', 'SemScroll')

    } else {
        article.className = 'containerMusicaCaixa'
    }
    let contadorMusicasPorSection = 0

    if(Pesquisa == 'Aleatórias') {
        arraymusicasAleatorias = [...TodasMusicas.Musicas]
        arraymusicasAleatorias.sort(() => Math.random() - 0.5)
    }

    const PesquisaFormatada = formatarTexto(Pesquisa)

    let contadorMusicasLinha = 0
    let arrayMusicasRetornadas = []
    for (let c = TodasMusicas.Musicas.length - 1; c >= 0; c--) {
        const NomeMusica = formatarTexto(TodasMusicas.Musicas[c].NomeMusica)
        const Autor = formatarTexto(TodasMusicas.Musicas[c].Autor)
        const Genero = formatarTexto(TodasMusicas.Musicas[c].Genero)
        let EmailUser = '&&&&&&&&&&&'

        if(PesquisarEmail) {
            EmailUser = formatarTexto(TodasMusicas.Musicas[c].EmailUser)
        }

        let musicaPassou = false

        if(Artista == true) {
            if(PesquisaFormatada.includes(Autor) || Autor.includes(PesquisaFormatada)) {
                musicaPassou = true
            }

        } else if (
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
            arrayMusicasRetornadas.push(TodasMusicas.Musicas[c])
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); // Gerar um índice aleatório
          // Trocar os elementos de posição
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      
      shuffleArray(arrayMusicasRetornadas)
      

    for(let c = 0; c < arrayMusicasRetornadas.length; c++) {
        contadorMusicasPorSection++

        if(Estilo == 'Caixa') {
            const div = document.createElement('div')
            const containerImg = document.createElement('div')
            const img = document.createElement('img')
            const divTexto = document.createElement('div')
            const darPlay = document.createElement('div')
            const p = document.createElement('p')
            const span = document.createElement('span')
            const divBlurTexto = document.createElement('div')

            div.className = 'MusicasCaixa'
            div.title = arrayMusicasRetornadas[c].NomeMusica
            darPlay.className = 'BtnDarPlay'
            darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`
            // div.style.backgroundImage = `url(${arrayMusicasRetornadas[c].LinkImg` //? ---
            // divBlurTexto.src = arrayMusicasRetornadas[c].LinkImg : //? ---
            //divBlurTexto.style.backgroundImage = `url(${arrayMusicasRetornadas[c].LinkImg})` //? ---

            img.src = arrayMusicasRetornadas[c].LinkImg
            if(img.src.includes('treefy')) {
                containerImg.classList.add('ContainerImgMusicaCaixa', 'ContainerImgMusicaCaixaTreeFy')
            } else {
                containerImg.classList.add('ContainerImgMusicaCaixa')
            }

            divTexto.className = 'TextoMusicaCaixa'
            p.innerText = arrayMusicasRetornadas[c].NomeMusica
            span.innerText = arrayMusicasRetornadas[c].Autor
            divBlurTexto.className = 'divBlurTexto'

            divTexto.appendChild(p)
            divTexto.appendChild(span)
            div.appendChild(darPlay)
            containerImg.appendChild(img)
            div.appendChild(containerImg)
            div.appendChild(divBlurTexto)
            div.appendChild(divTexto)
            article.appendChild(div)

            div.addEventListener('click', (event) => {
                if (event.target != span) {
                    ListaProxMusica = {
                        Musicas: arrayMusicasRetornadas,
                        Numero: c,
                    }
                    DarPlayMusica(arrayMusicasRetornadas[c], c)
                }
            })
            
            //? Ao clicar no nome do Autor
            span.addEventListener('click', () => {
                FecharPaginas()
                document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                document.getElementById('NomeArtista').innerText = span.innerText
                document.getElementById('containerMusicasArtista').innerHTML = ''
                document.querySelector('body').style.overflow = 'hidden'
                RetornarMusicasArtista(span.innerText, document.getElementById('containerMusicasArtista'))
                const PagArtistas = document.getElementById('PagArtistas')
                PagArtistas.style.display = 'block'
            })

        } else if(Estilo == 'Linha') {
            contadorMusicasLinha++
            article.className = 'containerMusicaLinha'

            const div = document.createElement('div')
            const divPrimeiraParte = document.createElement('div')
            const contador = document.createElement('p')
            const divImg = document.createElement('div')
            const img = document.createElement('img')
            const divTexto = document.createElement('div')
            const Nome = document.createElement('p')
            const AutorDaMusica = document.createElement('span')
            const Genero = document.createElement('p')
            const Heart = document.createElement('img')

            div.className = 'MusicasLinha'
            divTexto.className = 'TextoMusicaCaixa'
            Heart.className = 'btnCurtirMeuPerfil'
            divImg.className = 'DivImgMusicaMeuPerfil'
            img.className = 'ImgMusicaMeuPerfil'
            Genero.className = 'GeneroMeuPerfil'

            contador.innerText = contadorMusicasLinha
            img.src = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].LinkImg : TodasMusicas.Musicas[c].LinkImg

            img.src = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].LinkImg : TodasMusicas.Musicas[c].LinkImg
            if(img.src.includes('treefy')) {
                divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
            } else {
                divImg.classList.add('DivImgMusicaMeuPerfil')
            }

            Nome.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].NomeMusica : TodasMusicas.Musicas[c].NomeMusica
            AutorDaMusica.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Autor : TodasMusicas.Musicas[c].Autor
            Genero.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Genero : TodasMusicas.Musicas[c].Genero
            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
            
            divTexto.appendChild(Nome)
            divTexto.appendChild(AutorDaMusica)
            divPrimeiraParte.appendChild(contador)
            divImg.appendChild(img)
            divPrimeiraParte.appendChild(divImg)
            divPrimeiraParte.appendChild(divTexto)
            div.appendChild(divPrimeiraParte)
            div.appendChild(Genero)
            div.appendChild(Heart)
            article.appendChild(div)

            div.addEventListener('click', (event) => {
                if (event.target != AutorDaMusica && event.target != Heart) {
                    ListaProxMusica = {
                        Musicas: Pesquisa === 'Aleatórias' ? arraymusicasAleatorias : TodasMusicas.Musicas,
                        Numero: c,
                    }
                    DarPlayMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c] : TodasMusicas.Musicas[c], c)
                }
            })

            //? Vai checar se as músicas foram curtidas pelo user
            FavoritarDesfavoritarMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].ID : TodasMusicas.Musicas[c].ID, 'Checar').then((resolve) => {
                Heart.src = resolve
            })

            //? Vai curtir / descurtir a música
            Heart.addEventListener('click', () => {
                FavoritarDesfavoritarMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].ID : TodasMusicas.Musicas[c].ID, 'Editar').then((resolve) => {
                    Heart.src = resolve
                })
            })

            //? Ao clicar no nome do Autor
            AutorDaMusica.addEventListener('click', () => {
                FecharPaginas()
                document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                document.getElementById('NomeArtista').innerText = AutorDaMusica.innerText
                document.getElementById('containerMusicasArtista').innerHTML = ''
                document.querySelector('body').style.overflow = 'hidden'
                RetornarMusicasArtista(AutorDaMusica.innerText, document.getElementById('containerMusicasArtista'))
                const PagArtistas = document.getElementById('PagArtistas')
                PagArtistas.style.display = 'block'
            })
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

async function RetornarPerfil(Pesquisa, Local, PerfilDe = 'User') {

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
    
    if(PerfilDe == 'User') {
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

                for(let i = 0; i < TodasMusicas.Musicas.length; i++) {

                    for(let contadorMusicasPostadas = 0; contadorMusicasPostadas < TodosOsUsers[c].User.MusicasPostadas.length; contadorMusicasPostadas++) {
                        if(TodasMusicas.Musicas[i].ID == TodosOsUsers[c].User.MusicasPostadas[contadorMusicasPostadas]) {

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

                            img.src = TodasMusicas.Musicas[i].LinkImg
                            NomeMusica.innerText = TodasMusicas.Musicas[i].NomeMusica
                            Autor.innerText = TodasMusicas.Musicas[i].Autor
                            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'

                            divInfosMusica.appendChild(img)
                            divTexto.appendChild(NomeMusica)
                            divTexto.appendChild(Autor)
                            divInfosMusica.appendChild(divTexto)
                            musica.appendChild(divInfosMusica)
                            musica.appendChild(Heart)
                            ContainerMusicas.appendChild(musica)

                            divInfosMusica.addEventListener('click', (event) => {
                                if (event.target != Autor && event.target != Heart) {
                                    DarPlayMusica(TodasMusicas.Musicas[i], i)
                                }
                            })

                            //? Vai checar se as músicas foram curtidas pelo user
                            FavoritarDesfavoritarMusica(TodasMusicas.Musicas[i].ID, 'Checar').then((resolve) => {
                                Heart.src = resolve
                            })

                            //? Vai curtir / descurtir a música
                            Heart.addEventListener('click', () => {
                                FavoritarDesfavoritarMusica(TodasMusicas.Musicas[i].ID, 'Editar').then((resolve) => {
                                    Heart.src = resolve
                                })
                            })

                            //? Ao clicar no nome do Autor
                            Autor.addEventListener('click', () => {
                                FecharPaginas()
                                document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                                document.getElementById('NomeArtista').innerText = Autor.innerText
                                document.getElementById('containerMusicasArtista').innerHTML = ''
                                document.querySelector('body').style.overflow = 'hidden'
                                RetornarMusicasArtista(Autor.innerText, document.getElementById('containerMusicasArtista'))
                                const PagArtistas = document.getElementById('PagArtistas')
                                PagArtistas.style.display = 'block'
                            })
                        }
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

async function RetornarMusicasFavoritas(Email, Local, MusicaFavoritaOuPostada) {
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let contadorMusicasLinha = 0
    let musicasFavoritasUser = []

    if(MusicaFavoritaOuPostada == 'Favoritas') {
        for(let contadorMusicasCurtidas = currentUser.User.MusicasCurtidas.length; contadorMusicasCurtidas >= 0; contadorMusicasCurtidas--) {

            for(let contadorTodasAsMusicas = 0; contadorTodasAsMusicas < TodasMusicas.Musicas.length; contadorTodasAsMusicas++) {

                if(TodasMusicas.Musicas[contadorTodasAsMusicas].ID == currentUser.User.MusicasCurtidas[contadorMusicasCurtidas]) {
                    musicasFavoritasUser.push(TodasMusicas.Musicas[contadorTodasAsMusicas])
                    contadorMusicasLinha++
                    article.className = 'containerMusicaLinha'

                    const div = document.createElement('div')
                    const divPrimeiraParte = document.createElement('div')
                    const contador = document.createElement('p')
                    const divImg = document.createElement('div')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const Nome = document.createElement('p')
                    const AutorDaMusica = document.createElement('span')
                    const Genero = document.createElement('p')
                    const Heart = document.createElement('img')

                    div.className = 'MusicasLinha'
                    divTexto.className = 'TextoMusicaCaixa'
                    Heart.className = 'btnCurtirMeuPerfil'
                    divImg.className = 'DivImgMusicaMeuPerfil'
                    img.className = 'ImgMusicaMeuPerfil'
                    Genero.className = 'GeneroMeuPerfil'

                    contador.innerText = contadorMusicasLinha
                    img.src = TodasMusicas.Musicas[contadorTodasAsMusicas].LinkImg
                    Nome.innerText = TodasMusicas.Musicas[contadorTodasAsMusicas].NomeMusica
                    AutorDaMusica.innerText = TodasMusicas.Musicas[contadorTodasAsMusicas].Autor
                    Genero.innerText = TodasMusicas.Musicas[contadorTodasAsMusicas].Genero
                    Heart.src = './Assets/Imgs/Icons/icon _heart_.png'
                    
                    divTexto.appendChild(Nome)
                    divTexto.appendChild(AutorDaMusica)
                    divPrimeiraParte.appendChild(contador)
                    divImg.appendChild(img)
                    divPrimeiraParte.appendChild(divImg)
                    divPrimeiraParte.appendChild(divTexto)
                    div.appendChild(divPrimeiraParte)
                    div.appendChild(Genero)
                    div.appendChild(Heart)
                    article.appendChild(div)

                    let num = contadorMusicasLinha - 1
                    div.addEventListener('click', (event) => {
                        if (event.target != AutorDaMusica && event.target != Heart) {
                            ListaProxMusica = {
                                Musicas: musicasFavoritasUser,
                                Numero: contadorTodasAsMusicas,
                            }
    
                            DarPlayMusica(musicasFavoritasUser[num], num)
                        }
                    })

                    //? Ao clicar no btn de play
                    document.getElementById('imgMusicaFavoritaTocandoAgora').addEventListener('click', () => {
                        ListaProxMusica = {
                            Musicas: musicasFavoritasUser,
                            Numero: 0,
                        }

                        DarPlayMusica(musicasFavoritasUser[num], num)
                    })

                    Heart.addEventListener('click', () => {
                        FavoritarDesfavoritarMusica(musicasFavoritasUser[num].ID)
                        .then((resolve) => {
                            document.getElementById('localMusicasCurtidas').innerHTML = ''
                            musicasFavoritasUser.splice(num, 1)
                            RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
                        })
                        .catch((error) => {
                            alert(error)
                        })
                    })

                    //? Ao clicar no nome do Autor
                    AutorDaMusica.addEventListener('click', () => {
                        FecharPaginas()
                        document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                        document.getElementById('NomeArtista').innerText = AutorDaMusica.innerText
                        document.getElementById('containerMusicasArtista').innerHTML = ''
                        document.querySelector('body').style.overflow = 'hidden'
                        RetornarMusicasArtista(AutorDaMusica.innerText, document.getElementById('containerMusicasArtista'))
                        const PagArtistas = document.getElementById('PagArtistas')
                        PagArtistas.style.display = 'block'
                    })
                }
            }
        }
    }

    const section = document.createElement('section')

    //? Vai adicionar o article no html apenas se houver algunma música
    if(article.innerHTML != '') {
        section.className = 'containerMusica'
        section.appendChild(article)
        Local.appendChild(section)
    }
}

async function RetornarArtistas(Pesquisa, Local, Estilo = 'Linha') {
    if(Estilo == 'Perfil') {

    }
}

async function RecomendarMusicas() {
    let GenerosFavoritosUser = []
    let ArtistasFavoritos = []
    
    try {
        for(let i = 0; i < currentUser.User.MusicasCurtidas.length; i++) {
            for(let c = 0; c < arraymusicasAleatorias.length; c++) {
                if(arraymusicasAleatorias[c].ID == currentUser.User.MusicasCurtidas[i]) {
                    GenerosFavoritosUser.push(arraymusicasAleatorias[c].Genero)
                    ArtistasFavoritos.push(arraymusicasAleatorias[c].Autor)
                }
            }
        }
        const containerMain = document.getElementById('containerMain')

        let GenerosDasMusicasFavoritasUser = ordernarArray(GenerosFavoritosUser)
        let ArtistasDasMusicasFavoritasUser = ordernarArray(ArtistasFavoritos)

        //? Vai recomendar os generos que o user gosta
        // console.log(GenerosDasMusicasFavoritasUser);
        if(GenerosDasMusicasFavoritasUser.length > 2 && ArtistasDasMusicasFavoritasUser.length > 2) {
            RetornarMusicas(GenerosDasMusicasFavoritasUser[0], containerMain)
            RetornarMusicas(ArtistasDasMusicasFavoritasUser[0], containerMain)
            RetornarMusicas(GenerosDasMusicasFavoritasUser[1], containerMain)
            RetornarMusicas(ArtistasDasMusicasFavoritasUser[1], containerMain)
        }

        //? Vai recomendar os artistas que o user gosta
    } catch (error) {
        setTimeout(() => {
            RecomendarMusicas()
        }, 100)
    }
}// RecomendarMusicas()


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
        RetornarMusicas(inputPesquisa.value, document.getElementById('containerResultadoPesquisa'), 'Indeterminado', 'Caixa', false, false, 'SemScroll')

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

//? Vai abrir as músicas favoritas do user
const btnMusicasFavoritas = document.getElementById('btnMusicasFavoritas')
const musicasFavoritasPerfil = document.getElementById('musicasFavoritasPerfil')
btnMusicasFavoritas.addEventListener('click', () => {
    document.getElementById('localMusicasCurtidas').innerHTML = ''
    RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
})
musicasFavoritasPerfil.addEventListener('click', () => {
    AbrirPaginas(3)
    document.getElementById('localMusicasCurtidas').innerHTML = ''
    RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
})

let trocouDeMusica = false
let fimMusica = false
let isPlaying = false

let MusicaTocandoAgora = {}

//? Variaveis das informações do user gosto músical
let MusicaColetarDados = {}
let salvarHistorico = false

//? Vai dar play naas músicas
function DarPlayMusica(Lista, num) {
    console.log(Lista.ID);

    function EnviarDados() {
        if(audioPlayer.currentTime > 2) {
            if(salvarHistorico == false) {
                salvarHistorico = true
    
                MusicaColetarDados = {
                    Musica: Lista.ID
                }
            } else {
                MusicaColetarDados = {
                    Musica: MusicaColetarDados.Musica,
                    Tempo: audioPlayer.currentTime
                }
    
                coletarHistorico(MusicaColetarDados)
    
                salvarHistorico = false
                EnviarDados()
            }
        }
    } EnviarDados()

    MusicaTocandoAgora = Lista
    //? Vai checar se a música foi curtida ou n
    FavoritarDesfavoritarMusica(Lista.ID, 'Checar').then((resolve) => {
        document.getElementById('HeartBarraMusica').src = resolve
        document.getElementById('HeartBarraMusica2').src = resolve
    })

    if(trocouDeMusica == false) {
        trocouDeMusica = true
        document.title = `${Lista.NomeMusica}`
        
        setTimeout(() => {
            fimMusica = false
            trocouDeMusica = false
        }, 1000)

        //? ----------------------------------------------------------

        document.getElementById('BarraMusica').className = 'BarraMusicaOpen'
        const PlayBtn = document.getElementById('PlayBtn')
        PlayBtn.src = `Assets/Imgs/Icons/Pause.png`

        const PlayBtn2 = document.getElementById('PlayBtn2')
        PlayBtn2.src = `Assets/Imgs/Icons/Pause.png`

        const PlayCellBarraMusica = document.getElementById('PlayCellBarraMusica')
        PlayCellBarraMusica.src = `Assets/Imgs/Icons/Pause.png`

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
            NextSong()
        })

        navigator.mediaSession.setActionHandler('previoustrack', function() {
            BackSong()
        })

        audioPlayer.src = Lista.LinkAudio

        audioPlayer.addEventListener('canplaythrough', function() {
            audioPlayer.play()

            //? Vai mudar a informações na barra música para o pc
            document.getElementById('imgMusicaBarraMusica').src = Lista.LinkImg
            document.getElementById('NomeMusicaBarraMusica').innerText = Lista.NomeMusica
            document.getElementById('AutorMusicaBarraMusica').innerText = Lista.Autor

            //? Vai mudar a informações na barra música para o cell
            document.getElementById('containerImgMusicaTocandoAgora').style.backgroundImage = `url(${Lista.LinkImg})`
            document.getElementById('imgMusicaTocandoAgoraPagMusicaTocandoAgora').src = Lista.LinkImg
            document.getElementById('nomeMusicaTocandoAgoraPagMusicaTocandoAgora').innerText = Lista.NomeMusica
            document.getElementById('autorMusicaTocandoAgoraPagMusicaTocandoAgora').innerText = Lista.Autor

            //? Vai atualizar a barra de progresso da música
            let progressoMusicaBarraMusica = document.getElementById('progressoMusicaBarraMusica') //? Progresso barra para pc
            let progressoMusicaTocandoAgora = document.getElementById('progressoMusicaTocandoAgora') //? Progresso barra para cell

            audioPlayer.addEventListener('timeupdate', function() {
                const percentProgress = (audioPlayer.currentTime / audioPlayer.duration) * 100
                progressoMusicaBarraMusica.value = percentProgress
                progressoMusicaTocandoAgora.value = percentProgress
            })
        
            progressoMusicaBarraMusica.addEventListener('input', function() {
                const newTime = (progressoMusicaBarraMusica.value / 100) * audioPlayer.duration
                audioPlayer.currentTime = newTime
            })

            progressoMusicaTocandoAgora.addEventListener('input', function() {
                const newTime = (progressoMusicaTocandoAgora.value / 100) * audioPlayer.duration
                audioPlayer.currentTime = newTime
            })
        })

        audioPlayer.addEventListener('pause', function() {
            isPlaying = false
            PlayBtn.src = `Assets/Imgs/Icons/Play.png`
            PlayBtn2.src = `Assets/Imgs/Icons/Play.png`
            PlayCellBarraMusica.src = `Assets/Imgs/Icons/Play.png`
            document.title = `Musi .-. Verse`
        })
    
        audioPlayer.addEventListener('play', function() {
            isPlaying = true
            PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
            PlayBtn2.src = `Assets/Imgs/Icons/Pause.png`
            PlayCellBarraMusica.src = `Assets/Imgs/Icons/Pause.png`
            document.title = `${Lista.NomeMusica}`
        })

        // //? Ao acabar a música
        audioPlayer.addEventListener('ended', function() {
            if(fimMusica == false) {
                fimMusica = true
                NextSong()
            }
        })

    }
}

//? Vai curtir / descurtir a música ao clica no coração
const HeartBarraMusica = document.getElementById('HeartBarraMusica')
HeartBarraMusica.addEventListener('click', () => {
    FavoritarDesfavoritarMusica(MusicaTocandoAgora.ID, 'Editar')
    .then((resolve) => {
        HeartBarraMusica.src = resolve
    })
    .catch((error) => {
        alert(error)
    })
})

//? Vai pausar a música
PlayBtn.addEventListener('click', function() {
    PausaDespausarMusica()
})

PlayBtn2.addEventListener('click', function() {
    PausaDespausarMusica()
})

PlayCellBarraMusica.addEventListener('click', function() {
    PausaDespausarMusica()
})

function PausaDespausarMusica() {
    if(isPlaying == true) {
        document.title = `Musi ._. Verse`
        isPlaying = false
        PlayBtn.src = `Assets/Imgs/Icons/Play.png`
        PlayBtn2.src = `Assets/Imgs/Icons/Play.png`
        PlayCellBarraMusica.src = `Assets/Imgs/Icons/Play.png`
        audioPlayer.pause()

    } else {
        isPlaying = true
        PlayBtn.src = `Assets/Imgs/Icons/Pause.png`
        PlayBtn2.src = `Assets/Imgs/Icons/Pause.png`
        PlayCellBarraMusica.src = `Assets/Imgs/Icons/Pause.png`
        audioPlayer.play()
        // document.title = `${Lista.NomeMusica}`
    }
}

// //? Vai pular a música
const NextBtn = document.getElementById('NextBtn')
NextBtn.addEventListener("click", () => {
    NextSong()
})

const NextBtn2 = document.getElementById('NextBtn2')
NextBtn2.addEventListener("click", () => {
    NextSong()
})

function NextSong() {
    if(ListaProxMusica.Numero + 1 < ListaProxMusica.Musicas.length) {
        ListaProxMusica.Numero =  ListaProxMusica.Numero + 1
    } else {
        ListaProxMusica.Numero = 0
    }

    DarPlayMusica(ListaProxMusica.Musicas[ListaProxMusica.Numero], ListaProxMusica.Numero)
}

// //? Vai voltar para a música anterior
const BackBtn = document.getElementById('BackBtn')
BackBtn.addEventListener("click", () => {
    BackSong()
})

const BackBtn2 = document.getElementById('BackBtn2')
BackBtn2.addEventListener("click", () => {
    BackSong()
})

function BackSong() {
    if(ListaProxMusica.Numero > 0) {
        ListaProxMusica.Numero =  ListaProxMusica.Numero - 1
    } else {
        ListaProxMusica.Numero =  ListaProxMusica.Musicas.length
    }

    DarPlayMusica(ListaProxMusica.Musicas[ListaProxMusica.Numero], ListaProxMusica.Numero)
}

//? Vai curtir ou descurtir a música
function FavoritarDesfavoritarMusica(IdMusica, OqFazer = 'Editar') {
    console.log(IdMusica);
    let MusicaEncontrada = false
    return new Promise((resolve, reject) => {
        for(let c = 0; c <= currentUser.User.MusicasCurtidas.length; c++) {
            try {
                if(currentUser.User.MusicasCurtidas[c] == IdMusica && MusicaEncontrada == false) {
                    MusicaEncontrada = true
    
                    // Música encontrada nas curtidas, então descurta.
                    if(OqFazer == 'Editar') {
                        currentUser.User.MusicasCurtidas.splice(c, 1)
                        db.collection('Users')
                        .doc(currentUser.User.Id)
                        .update({ MusicasCurtidas: currentUser.User.MusicasCurtidas })
                        .then(() => {
                            resolve('./Assets/Imgs/Icons/icon _heart_ (1).png')
                        })
    
                    } else {
                        resolve('./Assets/Imgs/Icons/icon _heart_.png')
                    }
                }
    
                // Música não encontrada nas curtidas, então curta.
                if(c + 1 >= currentUser.User.MusicasCurtidas.length && MusicaEncontrada == false) {
                    MusicaEncontrada = true
                    
                    if(OqFazer == 'Editar') {
                        currentUser.User.MusicasCurtidas.push(IdMusica)
                        db.collection('Users')
                        .doc(currentUser.User.Id)
                        .update({ MusicasCurtidas: currentUser.User.MusicasCurtidas })
                        .then(() => {
                            resolve('./Assets/Imgs/Icons/icon _heart_.png')
                        })
    
                    } else {
                        resolve('./Assets/Imgs/Icons/icon _heart_ (1).png')
                    }
                }
            } catch (error) {
                console.warn(error)
            }
        }
    })
}

let arrayMusicasArtista = []
async function RetornarMusicasArtista(Artsita, Local) {
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let ArtistaFormadado = formatarTexto(Artsita)
    let contadorMusicasLinha = -1
    arrayMusicasArtista = [] //? Vai salvar as músicas do artista pesquisado para poder colocar como lista de prox músicas
    ListaProxMusica = {}

    for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
        let AutorFormadato  =  formatarTexto(TodasMusicas.Musicas[c].Autor)


        if(ArtistaFormadado.includes(AutorFormadato) || AutorFormadato.includes(ArtistaFormadado)) {
            contadorMusicasLinha++
            arrayMusicasArtista.push(TodasMusicas.Musicas[c])
            article.className = 'containerMusicaLinha'

            const div = document.createElement('div')
            const divPrimeiraParte = document.createElement('div')
            const contador = document.createElement('p')
            const divImg = document.createElement('div')
            const img = document.createElement('img')
            const divTexto = document.createElement('div')
            const Nome = document.createElement('p')
            const AutorDaMusica = document.createElement('span')
            const Genero = document.createElement('p')
            const Heart = document.createElement('img')

            div.className = 'MusicasLinha'
            divTexto.className = 'TextoMusicaCaixa'
            Heart.className = 'btnCurtirMeuPerfil'
            divImg.className = 'DivImgMusicaMeuPerfil'
            img.className = 'ImgMusicaMeuPerfil'
            Genero.className = 'GeneroMeuPerfil'

            contador.innerText = contadorMusicasLinha + 1
            img.src = TodasMusicas.Musicas[c].LinkImg
            Nome.innerText = TodasMusicas.Musicas[c].NomeMusica
            AutorDaMusica.innerText = TodasMusicas.Musicas[c].Autor
            Genero.innerText = TodasMusicas.Musicas[c].Genero
            Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
            
            divTexto.appendChild(Nome)
            divTexto.appendChild(AutorDaMusica)
            divPrimeiraParte.appendChild(contador)
            divImg.appendChild(img)
            divPrimeiraParte.appendChild(divImg)
            divPrimeiraParte.appendChild(divTexto)
            div.appendChild(divPrimeiraParte)
            div.appendChild(Genero)
            div.appendChild(Heart)
            article.appendChild(div)

            
            //? Ao clicar na música
            div.addEventListener('click', (event) => {
                if (event.target != AutorDaMusica && event.target != Heart) {
                    ListaProxMusica = {
                        Musicas: arrayMusicasArtista,
                        Numero: contadorMusicasLinha,
                    }
    
                    DarPlayMusica(TodasMusicas.Musicas[c], c)
                }
            })

            //? Vai checar se as músicas foram curtidas pelo user
            FavoritarDesfavoritarMusica(arrayMusicasArtista[contadorMusicasLinha].ID, 'Checar').then((resolve) => {
                Heart.src = resolve
            })

            //? Vai curtir / descurtir a música
            Heart.addEventListener('click', () => {
                FavoritarDesfavoritarMusica(arrayMusicasArtista[contadorMusicasLinha].ID, 'Editar').then((resolve) => {
                    Heart.src = resolve
                })
            })
        }
    }

    const section = document.createElement('section')
    section.className = 'containerMusica'
    section.appendChild(article)
    Local.appendChild(section)

}

//? Ao clicar no btn de play
const  btnPlayHeaderArtista = document.getElementById('btnPlayHeaderArtista')
btnPlayHeaderArtista.addEventListener('click', () => {
    console.log(arrayMusicasArtista[0]);
    ListaProxMusica = {
        Musicas: arrayMusicasArtista,
        Numero: 0,
    }
    
    DarPlayMusica(arrayMusicasArtista[0], 0)
})