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

const TodasMusicas = []
let arraymusicasAleatorias = []
function carregarMusicas() {
    let contador = 0

    return new Promise((resolve, reject) => {
        db.collection('MusicasPostadas').get().then((snapshot) => {
    
            snapshot.docs.forEach(Musicas => {
                const MusicasPostadas = Musicas.data()
                TodasMusicas.push(MusicasPostadas)

                TodasMusicas[contador].Id = Musicas.id

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

    async function RetornarMusicas(Pesquisa, Local, maxMusicas = 6, Estilo = 'Caixa', PesquisarEmail = false, Artista = false) {
        if(maxMusicas == 'Indeterminado') {
            maxMusicas = TodasMusicas.length
        }

        const article = document.createElement('article')
        article.className = 'containerMusicasOverflow'
        let contadorMusicasPorSection = 0
    
        if(Pesquisa == 'Aleatórias') {
            arraymusicasAleatorias = [...TodasMusicas]
            arraymusicasAleatorias.sort(() => Math.random() - 0.5)
        }
    
        const PesquisaFormatada = formatarTexto(Pesquisa)
    
        let contadorMusicasLinha = 0
        let arrayMusicasRetornadas = []
        for (let c = 0; c < TodasMusicas.length; c++) {
            const NomeMusica = formatarTexto(TodasMusicas[c].NomeMusica)
            const Autor = formatarTexto(TodasMusicas[c].Autor)
            const Genero = formatarTexto(TodasMusicas[c].Genero)
            let EmailUser = '&&&&&&&&&&&'

            if(PesquisarEmail) {
                EmailUser = formatarTexto(TodasMusicas[c].EmailUser)
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
                    div.title = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].NomeMusica : TodasMusicas[c].NomeMusica
                    darPlay.className = 'BtnDarPlay'
                    darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`
                    // div.style.backgroundImage = `url(${'Aleatórias' ? arraymusicasAleatorias[c].LinkImg : TodasMusicas[c].LinkImg})`
                    containerImg.className = 'ContainerImgMusicaCaixa'
                    img.src = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].LinkImg : TodasMusicas[c].LinkImg
                    divTexto.className = 'TextoMusicaCaixa'
                    p.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].NomeMusica : TodasMusicas[c].NomeMusica
                    span.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Autor : TodasMusicas[c].Autor
        
                    divTexto.appendChild(p)
                    divTexto.appendChild(span)
                    div.appendChild(darPlay)
                    containerImg.appendChild(img)
                    div.appendChild(containerImg)
                    div.appendChild(divTexto)
                    article.appendChild(div)

                    div.addEventListener('click', (event) => {
                        if (event.target != span) {
                            ListaProxMusica = {
                            Musicas: Pesquisa === 'Aleatórias' ? arraymusicasAleatorias : TodasMusicas,
                            Numero: c,
                            }
                            DarPlayMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c] : TodasMusicas[c], c)
                        }
                    })
                    
                    //? Ao clicar no nome do Autor
                    span.addEventListener('click', () => {
                        FecharPaginas()
                        const PagArtistas = document.getElementById('PagArtistas')
                        PagArtistas.style.display = 'block'
                        document.getElementById('NomeArtista').innerText = span.innerText
                        document.getElementById('containerMusicasArtista').innerHTML = ''
                        document.querySelector('body').style.overflow = 'hidden'
                        RetornarMusicasArtista(span.innerText, document.getElementById('containerMusicasArtista'))
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
                    img.src = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].LinkImg : TodasMusicas[c].LinkImg
                    Nome.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].NomeMusica : TodasMusicas[c].NomeMusica
                    AutorDaMusica.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Autor : TodasMusicas[c].Autor
                    Genero.innerText = Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Genero : TodasMusicas[c].Genero
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

                    divPrimeiraParte.addEventListener('click', () => {
                        ListaProxMusica = {
                            Musicas: Pesquisa === 'Aleatórias' ? arraymusicasAleatorias : TodasMusicas,
                            Numero: c,
                        }
                        DarPlayMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c] : TodasMusicas[c], c)
                    })

                    //? Vai checar se as músicas foram curtidas pelo user
                    FavoritarDesfavoritarMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Id : TodasMusicas[c].Id, 'Checar').then((resolve) => {
                        Heart.src = resolve
                    })

                    //? Vai curtir / descurtir a música
                    Heart.addEventListener('click', () => {
                        FavoritarDesfavoritarMusica(Pesquisa === 'Aleatórias' ? arraymusicasAleatorias[c].Id : TodasMusicas[c].Id, 'Editar').then((resolve) => {
                            Heart.src = resolve
                        })
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
    
                    for(let i = 0; i < TodasMusicas.length; i++) {
    
                        for(let contadorMusicasPostadas = 0; contadorMusicasPostadas < TodosOsUsers[c].User.MusicasPostadas.length; contadorMusicasPostadas++) {
                            if(TodasMusicas[i].Id == TodosOsUsers[c].User.MusicasPostadas[contadorMusicasPostadas]) {
    
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
    
                                img.src = TodasMusicas[i].LinkImg
                                NomeMusica.innerText = TodasMusicas[i].NomeMusica
                                Autor.innerText = TodasMusicas[i].Autor
                                Heart.src = './Assets/Imgs/Icons/icon _heart_ (1).png'
    
                                divInfosMusica.appendChild(img)
                                divTexto.appendChild(NomeMusica)
                                divTexto.appendChild(Autor)
                                divInfosMusica.appendChild(divTexto)
                                musica.appendChild(divInfosMusica)
                                musica.appendChild(Heart)
                                ContainerMusicas.appendChild(musica)
    
                                divInfosMusica.addEventListener('click', () => {
                                    DarPlayMusica(TodasMusicas[i], i)
                                })
    
                                //? Vai checar se as músicas foram curtidas pelo user
                                FavoritarDesfavoritarMusica(TodasMusicas[i].Id, 'Checar').then((resolve) => {
                                    Heart.src = resolve
                                })
    
                                //? Vai curtir / descurtir a música
                                Heart.addEventListener('click', () => {
                                    FavoritarDesfavoritarMusica(TodasMusicas[i].Id, 'Editar').then((resolve) => {
                                        Heart.src = resolve
                                    })
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

                for(let contadorTodasAsMusicas = 0; contadorTodasAsMusicas < TodasMusicas.length; contadorTodasAsMusicas++) {

                    if(TodasMusicas[contadorTodasAsMusicas].Id == currentUser.User.MusicasCurtidas[contadorMusicasCurtidas]) {
                        musicasFavoritasUser.push(TodasMusicas[contadorTodasAsMusicas])
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
                        img.src = TodasMusicas[contadorTodasAsMusicas].LinkImg
                        Nome.innerText = TodasMusicas[contadorTodasAsMusicas].NomeMusica
                        AutorDaMusica.innerText = TodasMusicas[contadorTodasAsMusicas].Autor
                        Genero.innerText = TodasMusicas[contadorTodasAsMusicas].Genero
                        Heart.src = './Assets/Imgs/Icons/icon _heart_.png'
                        
                        divTexto.appendChild(Nome)
                        divTexto.appendChild(AutorDaMusica)
                        divPrimeiraParte.appendChild(contador)
                        divPrimeiraParte.appendChild(img)
                        divPrimeiraParte.appendChild(divTexto)
                        div.appendChild(divPrimeiraParte)
                        div.appendChild(Genero)
                        div.appendChild(Heart)
                        article.appendChild(div)

                        let num = contadorMusicasLinha - 1
                        divPrimeiraParte.addEventListener('click', () => {
                            ListaProxMusica = {
                                Musicas: musicasFavoritasUser,
                                Numero: contadorTodasAsMusicas,
                            }

                            DarPlayMusica(musicasFavoritasUser[num], num)
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
                            FavoritarDesfavoritarMusica(musicasFavoritasUser[num].Id)
                            .then((resolve) => {
                                document.getElementById('localMusicasCurtidas').innerHTML = ''
                                RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
                            })
                            .catch((error) => {
                                alert(error)
                            })
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
    
    async function RetornarMusicasArtista(Artsita, Local) {
        const article = document.createElement('article')
        article.className = 'containerMusicasOverflow'
        let ArtistaFormadado = formatarTexto(Artsita)
        let contadorMusicasLinha = -1
        let arrayMusicasArtista = [] //? Vai salvar as músicas do artista pesquisado para poder colocar como lista de prox músicas

        for(let c = 0; c < TodasMusicas.length; c++) {
            let AutorFormadato  =  formatarTexto(TodasMusicas[c].Autor)


            if(ArtistaFormadado.includes(AutorFormadato) || AutorFormadato.includes(ArtistaFormadado)) {
                contadorMusicasLinha++
                arrayMusicasArtista.push(TodasMusicas[c])
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

                contador.innerText = contadorMusicasLinha + 1
                img.src = TodasMusicas[c].LinkImg
                Nome.innerText = TodasMusicas[c].NomeMusica
                AutorDaMusica.innerText = TodasMusicas[c].Autor
                Genero.innerText = TodasMusicas[c].Genero
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

                
                //? Ao clicar na música
                divPrimeiraParte.addEventListener('click', () => {
                    ListaProxMusica = {
                        Musicas: arrayMusicasArtista,
                        Numero: contadorMusicasLinha,
                    }

                    DarPlayMusica(TodasMusicas[c], c)
                })

                //? Ao clicar no btn de play
                document.getElementById('btnPlayHeaderArtista').addEventListener('click', () => {
                    ListaProxMusica = {
                        Musicas: arrayMusicasArtista,
                        Numero: 0,
                    }

                    DarPlayMusica(TodasMusicas[c], c)
                })

                //? Vai checar se as músicas foram curtidas pelo user
                FavoritarDesfavoritarMusica(arrayMusicasArtista[contadorMusicasLinha].Id, 'Checar').then((resolve) => {
                    Heart.src = resolve
                })

                //? Vai curtir / descurtir a música
                Heart.addEventListener('click', () => {
                    FavoritarDesfavoritarMusica(arrayMusicasArtista[contadorMusicasLinha].Id, 'Editar').then((resolve) => {
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

    async function RetornarArtistas(Pesquisa, Local, Estilo = 'Linha') {
        if(Estilo == 'Perfil') {

        }
    }

    //? Vai carregar as músicas na tela Home
    async function MostrarMusicas() {
        try {
            const containerMain = document.getElementById('containerMain')

            await RetornarMusicas('Aleatórias', containerMain)
            // await RetornarMusicas('Gospel', containerMain)
            // await RetornarMusicas('Rock', containerMain)
            // await RetornarMusicas('Country', containerMain)
            // await RetornarMusicas('Phonk', containerMain)
        } catch (error) {
            console.error('Ocorreu um erro:', error)
        }
    } MostrarMusicas() 

    async function RecomendarMusicas() {
        let GenerosFavoritosUser = []
        let ArtistasFavoritos = []
        
        try {
            for(let i = 0; i < currentUser.User.MusicasCurtidas.length; i++) {
                for(let c = 0; c < TodasMusicas.length; c++) {
                    if(TodasMusicas[c].Id == currentUser.User.MusicasCurtidas[i]) {
                        GenerosFavoritosUser.push(TodasMusicas[c].Genero)
                        ArtistasFavoritos.push(TodasMusicas[c].Autor)
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
    } RecomendarMusicas()
    
    
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

    //? Vai abrir as músicas favoritas do user
    const btnMusicasFavoritas = document.getElementById('btnMusicasFavoritas')
    btnMusicasFavoritas.addEventListener('click', () => {
        document.getElementById('localMusicasCurtidas').innerHTML = ''
        RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
    })
})

let trocouDeMusica = false
let fimMusica = false
let isPlaying = false

let MusicaTocandoAgora = {}

//? Vai dar play naas músicas
function DarPlayMusica(Lista, num) {
    MusicaTocandoAgora = Lista
    //? Vai checar se a música foi curtida ou n
    FavoritarDesfavoritarMusica(Lista.Id, 'Checar').then((resolve) => {
        document.getElementById('HeartBarraMusica').src = resolve
    })

    if(trocouDeMusica == false) {
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
            NextSong()
        })

        navigator.mediaSession.setActionHandler('previoustrack', function() {
            BackSong()
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
                NextSong()
            }
        })

    }
}

//? Vai curtir / descurtir a música ao clica no coração
const HeartBarraMusica = document.getElementById('HeartBarraMusica')
HeartBarraMusica.addEventListener('click', () => {
    FavoritarDesfavoritarMusica(MusicaTocandoAgora.Id, 'Editar')
    .then((resolve) => {
        HeartBarraMusica.src = resolve
    })
    .catch((error) => {
        alert(error)
    })
})

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
const NextBtn = document.getElementById('NextBtn')
NextBtn.addEventListener("click", () => {
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