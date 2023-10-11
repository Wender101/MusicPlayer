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

async function RetornarMusicas(Pesquisa, Local, maxMusicas = 10, Estilo = 'Caixa', PesquisarEmail = false, Artista = false, ClassArticle) {
    if(maxMusicas == 'Indeterminado') {
        maxMusicas = TodasMusicas.Musicas.length
    }
    
    const article = document.createElement('article')
    
    if(ClassArticle) {
        article.classList.add('containerMusicaCaixa', 'SemScroll')
    } else {
      article.className = 'containerMusicaCaixa'
    }
    let contadorMusicasPorSection = 0
    
    if(Pesquisa == 'Aleatórias') {
        arraymusicasAleatorias = [...TodasMusicas.Musicas]
        arraymusicasAleatorias.sort(() => Math.random() - 0.5)
    }
    
    let PesquisaFormatada = formatarTexto(Pesquisa)
    
    let contadorMusicasLinha = 0
    let arrayMusicasRetornadas = []
    for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
        let NomeMusica = formatarTexto(TodasMusicas.Musicas[c].NomeMusica)
        let Autor = formatarTexto(TodasMusicas.Musicas[c].Autor)
        let Genero = formatarTexto(TodasMusicas.Musicas[c].Genero)
        let EmailUser = '&&&&&&&&&&&'
        let musicaPassou = false
        
        if(Artista) {
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
            if(Pesquisa == 'Aleatórias') {
                arrayMusicasRetornadas = arraymusicasAleatorias.slice(0, maxMusicas)
            } else {
                arrayMusicasRetornadas.push(TodasMusicas.Musicas[c])
            }
        }
    }
  
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
    
    shuffleArray(arrayMusicasRetornadas)
  
    for(let c = 0; c < arrayMusicasRetornadas.length && c < maxMusicas; c++) {
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
                AbrirTelaTocandoAgora(Pesquisa)

                ListaProxMusica = {
                    Musicas: arrayMusicasRetornadas,
                    Numero: c,
                }

                DarPlayMusica(arrayMusicasRetornadas[c], c)
            }
        })
  
        span.addEventListener('click', () => {
          FecharPaginas()
          const imgPerfilArtista = document.getElementById('imgPerfilArtista')
          if(img.src.includes ('treefy')) {
            imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
          } else {
            imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
          }
          imgPerfilArtista.src = img.src
          document.getElementById('NomeArtista').innerText = span.innerText
          document.getElementById('containerMusicasArtista').innerHTML = ''
          document.querySelector('body').style.overflow = 'hidden'
          RetornarMusicasArtista(span.innerText, document.getElementById('containerMusicasArtista'))
          SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
          coletarHistorico(span.innerText, 'Autor')
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
        img.src = arrayMusicasRetornadas[c].LinkImg
        if(img.src.includes('treefy')) {
          divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
        } else {
          divImg.classList.add('DivImgMusicaMeuPerfil')
        }
  
        Nome.innerText = arrayMusicasRetornadas[c].NomeMusica
        AutorDaMusica.innerText = arrayMusicasRetornadas[c].Autor
        Genero.innerText = arrayMusicasRetornadas[c].Genero
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
            AbrirTelaTocandoAgora(Pesquisa)

          if (event.target != AutorDaMusica && event.target != Heart) {
            ListaProxMusica = {
              Musicas: ParrayMusicasRetornadas[c],
              Numero: c,
            }
            DarPlayMusica(arrayMusicasRetornadas[c], c)
          }
        })
  
        FavoritarDesfavoritarMusica(arrayMusicasRetornadas.ID, 'Checar').then((resolve) => {
          Heart.src = resolve
        })
  
        Heart.addEventListener('click', () => {
          FavoritarDesfavoritarMusica(arrayMusicasRetornadas.ID, 'Editar').then((resolve) => {
            Heart.src = resolve
          })
        })
  
        AutorDaMusica.addEventListener('click', () => {
          FecharPaginas()
          const imgPerfilArtista = document.getElementById('imgPerfilArtista')
          if(img.src.includes ('treefy')) {
            imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
          } else {
            imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
          }
          imgPerfilArtista.src = img.src
          document.getElementById('NomeArtista').innerText = AutorDaMusica.innerText
          document.getElementById('containerMusicasArtista').innerHTML = ''
          document.querySelector('body').style.overflow = 'hidden'
          RetornarMusicasArtista(AutorDaMusica.innerText, document.getElementById('containerMusicasArtista'))
          SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
          coletarHistorico(AutorDaMusica.innerText, 'Autor')
        })
      }
    }
  
    const h1 = document.createElement('h1')
    const section = document.createElement('section')
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'
  
    if(article.innerHTML != '') {
      h1.innerText = Pesquisa === 'Aleatórias' ? 'Aleatórias' : Pesquisa
      section.className = 'containerMusica'
  
        if(Estilo != 'Linha') {
            section.appendChild(h1)
        } else {
            articleContainer.style.width = '100%'
            articleContainer.style.padding = '0'
        }
  
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }
  
    if(ClassArticle != 'SemScroll') {
        const divBtnsScrollHorizontal = document.createElement('div')
        divBtnsScrollHorizontal.className = 'divBtnsScrollHorizontal'
    
        const btnBackScrollHorizontal = document.createElement('button')
        const imgBack = document.createElement('img')
        imgBack.src = 'Assets/Imgs/Icons/BackPag.png'
    
        const btnNextScrollHorizontal = document.createElement('button')
        const imgNext = document.createElement('img')
        imgNext.src = 'Assets/Imgs/Icons/NextPag.png'
    
        btnBackScrollHorizontal.appendChild(imgBack)
        btnNextScrollHorizontal.appendChild(imgNext)
        divBtnsScrollHorizontal.appendChild(btnBackScrollHorizontal)
        divBtnsScrollHorizontal.appendChild(btnNextScrollHorizontal)
        section.appendChild(divBtnsScrollHorizontal)
    
        let scrollStep = section.scrollWidth
        let contadorScroll = 0
        function handleResize() {
        scrollStep = section.scrollWidth
        checkScrollLimit()
    
        if (articleContainer.scrollWidth > section.scrollWidth) {
            divBtnsScrollHorizontal.style.display = 'flex'
        } else {
            divBtnsScrollHorizontal.style.display = 'none'
        }
        }
        window.addEventListener('resize', handleResize)
        handleResize()
    
        btnBackScrollHorizontal.addEventListener('click', () => {
            articleContainer.scrollLeft -= scrollStep
            contadorScroll--
            checkScrollLimit()
        })
    
        btnNextScrollHorizontal.addEventListener('click', () => {
            articleContainer.scrollLeft += scrollStep
            contadorScroll++
            checkScrollLimit()
        })
    
        function checkScrollLimit() {
        if(contadorScroll <= 0) {
            btnBackScrollHorizontal.style.opacity = 0.3
        } else {
            btnBackScrollHorizontal.style.opacity = 1
        }
    
        if(contadorScroll < (articleContainer.scrollWidth / section.scrollWidth) - 1) {
            btnNextScrollHorizontal.style.opacity = 1
        } else {
            btnNextScrollHorizontal.style.opacity = 0.3
        }
        }
        checkScrollLimit()
    }
  }
  

async function RetornarPerfil(Pesquisa, Local, PerfilDe = 'User') {
    let feito = false

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

            if(PesquisaFormatada.includes(Nome) || Nome.includes(PesquisaFormatada) && !feito) {
                feito = true

                DarkOverlay.addEventListener('click', () => {
                    AbrirPerfilOutroUser(TodosOsUsers[c].User)
                })
                
                //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
                var imgTeste = new Image()
                imgTeste.src = TodosOsUsers[c].User.Personalizar.Background
                imgTeste.onload = function() {
                    Perfil.style.backgroundImage = `url(${TodosOsUsers[c].User.Personalizar.Background})`
                }
                imgTeste.onerror = function() {
                    Perfil.style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
                }
                
                var imgTeste2 = new Image()
                imgTeste2.src = TodosOsUsers[c].User.Personalizar.FotoPerfil
                imgTeste2.onload = function() {
                    FotoPerfil.src = TodosOsUsers[c].User.Personalizar.FotoPerfil
                    FotoPerfil.style.display = 'block'
                }
                imgTeste2.onerror = function() {
                    FotoPerfil.style.display = 'none'
                }

                NomeUserPesquisado.innerText = TodosOsUsers[c].User.Nome
                Perfil.appendChild(DarkOverlay)
                Perfil.appendChild(FotoPerfil)
                Perfil.appendChild(NomeUserPesquisado)
                divContainer.appendChild(Perfil)

                //? ---------------------------------------------------------------------------------

                for(let i = TodasMusicas.Musicas.length -1; i > 0; i--) {

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
                                // document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                                const imgPerfilArtista = document.getElementById('imgPerfilArtista')
                                if(img.src.includes ('treefy')) {
                                    imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
                                } else {
                                    imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
                                }
                                imgPerfilArtista.src = img.src
                                document.getElementById('NomeArtista').innerText = Autor.innerText
                                document.getElementById('containerMusicasArtista').innerHTML = ''
                                document.querySelector('body').style.overflow = 'hidden'
                                RetornarMusicasArtista(Autor.innerText, document.getElementById('containerMusicasArtista'))
                                SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
                                coletarHistorico(Autor.innerText, 'Autor')
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

let musicasFavoritasUser = []
let numMusicasFavoritas = 0
async function RetornarMusicasFavoritas(Email, Local, MusicaFavoritaOuPostada) {
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let contadorMusicasLinha = 0
    musicasFavoritasUser = []

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
                        AbrirTelaTocandoAgora(musicasFavoritasUser[numMusicasFavoritas])

                        if (event.target != AutorDaMusica && event.target != Heart) {
                            ListaProxMusica = {
                                Musicas: musicasFavoritasUser,
                                Numero: contadorTodasAsMusicas,
                            }
    
                            DarPlayMusica(musicasFavoritasUser[numMusicasFavoritas], numMusicasFavoritas)
                        }
                    })

                    Heart.addEventListener('click', () => {
                        FavoritarDesfavoritarMusica(musicasFavoritasUser[numMusicasFavoritas].ID)
                        .then((resolve) => {
                            document.getElementById('localMusicasCurtidas').innerHTML = ''
                            musicasFavoritasUser.splice(numMusicasFavoritas, 1)
                            RetornarMusicasFavoritas(currentUser.InfoEmail.email, document.getElementById('localMusicasCurtidas'), 'Favoritas')
                        })
                        .catch((error) => {
                            alert(error)
                        })
                    })

                    //? Ao clicar no nome do Autor
                    AutorDaMusica.addEventListener('click', () => {
                        FecharPaginas()
                        // document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                        const imgPerfilArtista = document.getElementById('imgPerfilArtista')
                        if(img.src.includes ('treefy')) {
                            imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
                        } else {
                            imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
                        }
                        imgPerfilArtista.src = img.src
                        document.getElementById('NomeArtista').innerText = AutorDaMusica.innerText
                        document.getElementById('containerMusicasArtista').innerHTML = ''
                        document.querySelector('body').style.overflow = 'hidden'
                        RetornarMusicasArtista(AutorDaMusica.innerText, document.getElementById('containerMusicasArtista'))
                        SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
                        coletarHistorico(AutorDaMusica.innerText, 'Autor')
                    })
                }
            }
        }
    }

    const section = document.createElement('section')

    //? Vai adicionar o article no html apenas se houver algunma música
    if(article.innerHTML != '') {
        section.className = 'containerMusica'
        const articleContainer = document.createElement('article')
        articleContainer.className = 'articleContainer'
        articleContainer.style.width = '100%'
        articleContainer.style.padding = '0'
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }
}

 //? Ao clicar no btn de play
 document.getElementById('imgMusicaFavoritaTocandoAgora').addEventListener('click', () => {
    AbrirTelaTocandoAgora(musicasFavoritasUser[numMusicasFavoritas])

    ListaProxMusica = {
        Musicas: musicasFavoritasUser,
        Numero: 0,
    }

    DarPlayMusica(musicasFavoritasUser[numMusicasFavoritas], numMusicasFavoritas)
})


let arrayMusicasPostadasPeloUser = []
async function RetornarMusicasPostadasPeloUser(EmailUser, Local) {
    arrayMusicasPostadasPeloUser = []
    const article = document.createElement('article')
    let contadorMusicasLinha = 0

    for(let c = TodasMusicas.Musicas.length - 1; c > 0; c--) {

        if(EmailUser == TodasMusicas.Musicas[c].EmailUser) {
            arrayMusicasPostadasPeloUser.push(TodasMusicas.Musicas[c])
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
            img.src = TodasMusicas.Musicas[c].LinkImg

            img.src = TodasMusicas.Musicas[c].LinkImg
            if(img.src.includes('treefy')) {
                divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
            } else {
                divImg.classList.add('DivImgMusicaMeuPerfil')
            }

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

            div.addEventListener('click', (event) => {
                if (event.target != AutorDaMusica && event.target != Heart) {
                    ListaProxMusica = {
                        Musicas: TodasMusicas.Musicas,
                        Numero: c,
                    }
                    DarPlayMusica(TodasMusicas.Musicas[c], c)
                    AbrirTelaTocandoAgora(TodasMusicas.Musicas[c])
                }
            })

            //? Vai checar se as músicas foram curtidas pelo user
            FavoritarDesfavoritarMusica(TodasMusicas.Musicas[c].ID, 'Checar').then((resolve) => {
                Heart.src = resolve
            })

            //? Vai curtir / descurtir a música
            Heart.addEventListener('click', () => {
                FavoritarDesfavoritarMusica(TodasMusicas.Musicas[c].ID, 'Editar').then((resolve) => {
                    Heart.src = resolve
                })
            })

            //? Ao clicar no nome do Autor
            AutorDaMusica.addEventListener('click', () => {
                FecharPaginas()
                // document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
                const imgPerfilArtista = document.getElementById('imgPerfilArtista')
                if(img.src.includes ('treefy')) {
                    imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
                } else {
                    imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
                }
                imgPerfilArtista.src = img.src
                document.getElementById('NomeArtista').innerText = AutorDaMusica.innerText
                document.getElementById('containerMusicasArtista').innerHTML = ''
                document.querySelector('body').style.overflow = 'hidden'
                RetornarMusicasArtista(AutorDaMusica.innerText, document.getElementById('containerMusicasArtista'))
                SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
                coletarHistorico(AutorDaMusica.innerText, 'Autor')
            })
        }
    }

    const section = document.createElement('section')
    //? Vai adicionar o article no html apenas se houver algunma música
    if(article.innerHTML != '') {
        section.className = 'containerMusica'
        const articleContainer = document.createElement('article')
        articleContainer.style.width = '100%'
        articleContainer.style.padding = '0'
        articleContainer.className = 'articleContainer'
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }

}

//? Vai pesquisar pelas músicas
const inputPesquisa = document.getElementById('inputPesquisa')
inputPesquisa.addEventListener('keypress', (e) => {
    if(e.keyCode == 13 && inputPesquisa.value.trim() != "") {
        // SalvarHistoricoDePaginas(document.getElementById('PagPesquisa'))
        document.getElementById('containerResultadoPesquisa').innerHTML = ''

        //? Indo ali ---------------------------------
        if(formatarTexto(inputPesquisa.value).includes(formatarTexto('we live, we love, we lie'))) {
            for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
                if(TodasMusicas.Musicas[c].NomeMusica == 'BEAT INDO ALI - MEME VIRAL') {
                    DarPlayMusica(TodasMusicas.Musicas[c], c)

                    document.getElementById('PagPesquisa').style.backgroundImage = `url('https://i.ytimg.com/vi/9LFqwZPlih4/sddefault.jpg')`
                }
            }
        } else {
            document.getElementById('PagPesquisa').style.backgroundImage = ``
        }
        
        //? Vai pesquisar por um perfil
        RetornarPerfil(inputPesquisa.value, document.getElementById('containerResultadoPesquisa'))

        //? Vai pesquisar por Playlists
        RetornarPlayList(inputPesquisa.value, document.getElementById('containerResultadoPesquisa'), 'Caixa')
        
        //? Vai pesquisar por músicas
        RetornarMusicas(inputPesquisa.value, document.getElementById('containerResultadoPesquisa'), 'Indeterminado', 'Caixa', false, false, 'SemScroll')
        document.querySelector('body').style.overflowY = 'hidden'
        document.getElementById('PagPesquisa').style.display = 'block'
    }
})

//? Vai pegar as músicas postadas pelo user ao abrir o perfil
const btnMeuPerfil = document.getElementById('btnMeuPerfil')
btnMeuPerfil.addEventListener('click', () => {
    document.getElementById('NomeUserMeuPerfil').innerText = currentUser.User.Nome

    if(currentUser.User.Personalizar.Background != null && currentUser.User.Personalizar.Background.trim() != '') {
        
        try {
            if(currentUser.User.Personalizar.RepetirBackGround || currentUser.User.Personalizar.RepetirBackGround == undefined) {
                document.getElementById('coainerBackgroundPerfil').classList.add('RepetirBackgroundPerfilUser')
            }
        } catch{}

        //? Vai checar se está tudo certo com a img de background caso n esteja vai substituila
        var img = new Image()
        img.src = currentUser.User.Personalizar.Background
        img.onload = function() {
            document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(${currentUser.User.Personalizar.Background})`
        }
        img.onerror = function() {
            alert('Algo deu errado com img de background. Tente outra.')
            document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
        }

        //? Vai checar se está tudo certo com a img de perfil
        var imgTeste2 = new Image()
        imgTeste2.src = currentUser.User.Personalizar.FotoPerfil
        const FotoPerfil = document.getElementById('imgPerfilUserHeaderUser')
        imgTeste2.onload = function() {
            FotoPerfil.src = currentUser.User.Personalizar.FotoPerfil
            document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'block'
            document.getElementById('coainerBackgroundPerfil').style.alignItems = 'center'
            document.getElementById('coteudoHeaderPerfil').style.height = '80%'
        }
        imgTeste2.onerror = function() {
            document.getElementById('coainerBackgroundPerfil').style.alignItems = 'end'
            document.getElementById('coteudoHeaderPerfil').style.height = '50%'
            document.getElementById('containerImgPerfilUserHeaderUser').style.display = 'none'
        }

    } else {
        document.getElementById('coainerBackgroundPerfil').style.backgroundImage = `url(Assets/Imgs/Banners/fitaCassete.avif)`
        document.getElementById('coainerBackgroundPerfil').classList.add('RepetirBackgroundPerfilUser')
    }

    document.getElementById('containerMusicasPerfilUser').innerHTML = ''
    RetornarMusicasPostadasPeloUser(currentUser.InfoEmail.email, document.getElementById('containerMusicasPerfilUser'))
})

//? Vai tocar as músicas do user
//? Ao clicar no btn de play
const  btnPlayHeaderPerfil = document.getElementById('btnPlayHeaderPerfil')
btnPlayHeaderPerfil.addEventListener('click', () => {
    ListaProxMusica = {
        Musicas: arrayMusicasPostadasPeloUser,
        Numero: 0,
    }
    DarPlayMusica(arrayMusicasPostadasPeloUser[0], 0)
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
    function AtualizarViewSemanal() {
        let userEncontrado = false

        for(let c = 0; c < TodosOsUsers.length; c++) {
            if(TodosOsUsers[c].User.Email == Lista.EmailUser && userEncontrado == false) {
                userEncontrado = true

                db.collection('Users').doc(TodosOsUsers[c].User.Id).get().then((Users) => {
                        const Usuarios = Users.data()
                    if(Usuarios.Email == Lista.EmailUser) {
                        let infosUser = Usuarios.InfosPerfil
    
                        let dataHj = new Date()
                        const DataAtual = `${dataHj.getDate()}${dataHj.getMonth() +1}${dataHj.getFullYear()}`
                        //? Caso tenha acabado a semana vai zerar as views do user
                        try {
                            if(infosUser.ViewsSemanais.Data - DataAtual >= 7) {
                                infosUser.ViewsSemanais.Data = DataAtual
                                infosUser.ViewsSemanais.Views = 1
                            } else {
                                infosUser.ViewsSemanais.Views = parseInt(infosUser.ViewsSemanais.Views) + 1
                            }
                        } catch {
                            const newInfoUser = {
                                Seguidores: infosUser.Seguidores,
                                Seguindo: infosUser.Seguindo,
                                Amigos: infosUser.Amigos,
                                ViewsSemanais: {
                                    Data: DataAtual,
                                    Views: 1
                                },
                            }

                            infosUser = newInfoUser
                        }
    
                        setTimeout(() => {
                            db.collection('Users').doc(TodosOsUsers[c].User.Id).update({ InfosPerfil: infosUser })
                        }, 500)
                    }
                })
            }
        }
    } AtualizarViewSemanal()

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

    AddInfoTelaTocandoAgora(Lista)

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
            const imgMusicaBarraMusica = document.getElementById('imgMusicaBarraMusica')
            if(Lista.LinkImg.includes('treefy')) {
                imgMusicaBarraMusica.classList.add('imgMusicaBarraMusicaTreeFy')
            } else {
                imgMusicaBarraMusica.classList.remove('imgMusicaBarraMusicaTreeFy')
            }
            imgMusicaBarraMusica.src = Lista.LinkImg
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

        //? Vai abrir a aba com as músicas do autor ques está ouvindo a música
        document.getElementById('AutorMusicaBarraMusica').addEventListener('click', () => {
            FecharPaginas()
            const imgPerfilArtista = document.getElementById('imgPerfilArtista')
            if(Lista.LinkImg.includes ('treefy')) {
              imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
            } else {
              imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
            }
            imgPerfilArtista.src = Lista.LinkImg
            document.getElementById('NomeArtista').innerText = Lista.Autor
            document.getElementById('containerMusicasArtista').innerHTML = ''
            document.querySelector('body').style.overflow = 'hidden'
            RetornarMusicasArtista(Lista.Autor, document.getElementById('containerMusicasArtista'))
            SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
            coletarHistorico(Lista.Autor, 'Autor')
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
async function RetornarMusicasArtista(Artista, Local) {
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let ArtistaFormadado = formatarTexto(Artista)
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
                AbrirTelaTocandoAgora(Artista)

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
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'
    articleContainer.style.width = '100%'
    articleContainer.style.padding = '0'
    articleContainer.appendChild(article)
    section.appendChild(articleContainer)
    Local.appendChild(section)

}

//? Ao clicar no btn de play
const  btnPlayHeaderArtista = document.getElementById('btnPlayHeaderArtista')
btnPlayHeaderArtista.addEventListener('click', () => {
    AbrirTelaTocandoAgora(arrayMusicasArtista[0])

    ListaProxMusica = {
        Musicas: arrayMusicasArtista,
        Numero: 0,
    }
    
    DarPlayMusica(arrayMusicasArtista[0], 0)
})

//? Vai adicionar as informações na tela tocando agora
let infoMusicaTocandoAgora
function AddInfoTelaTocandoAgora(Musica) {
    infoMusicaTocandoAgora = Musica
    document.getElementById('btnAbrirTelaTocandoAgora').style.display = 'block'

    const TituloMusicaTelaTocandoAgora = document.getElementById('TituloMusicaTelaTocandoAgora')
    const imgMusicaTelaTocandoAgora = document.getElementById('imgMusicaTelaTocandoAgora')
    const NomeMusicaTelaTocandoAgora = document.getElementById('NomeMusicaTelaTocandoAgora')
    const AutorMusicaTelaTocandoAgora = document.getElementById('AutorMusicaTelaTocandoAgora')
    const imgUserPostouMusicaTelaTocandoAgora = document.getElementById('imgUserPostouMusicaTelaTocandoAgora')
    const NomeUserPostouMusicaTelaTocandoAgora = document.getElementById('NomeUserPostouMusicaTelaTocandoAgora')
    const NumeroOuvintesTelaTocandoAgora = document.getElementById('NumeroOuvintesTelaTocandoAgora')
    const btnSeguirUserTelaTocandoAgora = document.getElementById('btnSeguirUserTelaTocandoAgora')

    imgMusicaTelaTocandoAgora.src = Musica.LinkImg

    if(imgMusicaTelaTocandoAgora.src.includes('treefy')) {
        imgMusicaTelaTocandoAgora.classList.add('imgMusicaTelaTocandoAgoraTreeFy')
      } else {
        imgMusicaTelaTocandoAgora.classList.remove('imgMusicaTelaTocandoAgoraTreeFy')
      }
    NomeMusicaTelaTocandoAgora.innerText = Musica.NomeMusica
    AutorMusicaTelaTocandoAgora.innerText = Musica.Autor

    //? Vai pegar as informações do user que postou a música
    let seguindoEsseUser = false
    btnSeguirUserTelaTocandoAgora.style.display = ''
    for(let c = 0; c < TodosOsUsers.length; c++) {
        if(TodosOsUsers[c].User.Email == Musica.EmailUser) {
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
                        imgUserPostouMusicaTelaTocandoAgora.src = imgPerfil.src
                    } else if (imgBackground) {
                        imgUserPostouMusicaTelaTocandoAgora.src = imgBackground.src
                    } else {
                        imgUserPostouMusicaTelaTocandoAgora.src = 'Assets/Imgs/Banners/fitaCassete.avif'
                    }
                })
            })
              

            NomeUserPostouMusicaTelaTocandoAgora.innerText = TodosOsUsers[c].User.Nome
            
            try {
                NumeroOuvintesTelaTocandoAgora.innerText = `${TodosOsUsers[c].User.InfosPerfil.ViewsSemanais.Views} Ouvintes semanais`
            } catch{}

            //? Vai checar se você segue o user ou se o user pesquisado é você
            for(let i = 0; i <= currentUser.User.InfosPerfil.Seguindo.length; i++) {
                
                try {
                    if(currentUser.User.InfosPerfil.Seguindo[i] == TodosOsUsers[c].User.Email) {

                        seguindoEsseUser = true
                        btnSeguirUserTelaTocandoAgora.classList.add('btnSeguindoUser')
                        btnSeguirUserTelaTocandoAgora.innerText = 'Seguindo'
                        
                        
                    } else if(TodosOsUsers[c].User.Email == currentUser.User.Email) {
                        seguindoEsseUser = true
                        btnSeguirUserTelaTocandoAgora.style.display = 'none'
                    }
                } catch (error) {
                    console.warn(error)
                }
            }
            
            if(!seguindoEsseUser) {
                btnSeguirUserTelaTocandoAgora.style.display = ''
                btnSeguirUserTelaTocandoAgora.innerText = 'Seguir'
            }

            //? Vai começar a seguir
            btnSeguirUserTelaTocandoAgora.addEventListener('click', () => {
                let seguindoEsseUserBtn = false
                let feito = false
                let contador = 0
                for(let f = 0; f <= currentUser.User.InfosPerfil.Seguindo.length; f++) {
                    try {
                        if(TodosOsUsers[c].User.Email == currentUser.User.InfosPerfil.Seguindo[f] && TodosOsUsers[c].User.Email != currentUser.User.Email && !feito) {
                            feito = true
                           seguindoEsseUserBtn = true
                           contador = f
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
                    btnSeguirUserTelaTocandoAgora.innerText = 'Seguir'
                    oqFazerComUser = 'Remover Dos Seguidores'
            
                } else {
                    currentUser.User.InfosPerfil.Seguindo.push(TodosOsUsers[c].User.Email)
                    seguindoEsseUserBtn = true
                    btnSeguirUserTelaTocandoAgora.innerText = 'Seguindo'
                    oqFazerComUser = 'Adicionar Nos Seguidores'
                }
                db.collection('Users').doc(currentUser.User.Id).update({ InfosPerfil: currentUser.User.InfosPerfil }).then(() => {
                    //? Vai salvar no perfil do user pequisado o novo seguidor
                    let NovoSeguidorSalvo = false
                    db.collection('Users').get().then((snapshot) => {
                        snapshot.docs.forEach(Users => {
            
                            if(Users.data().Email == TodosOsUsers[c].User.Email && !NovoSeguidorSalvo) {
                                NovoSeguidorSalvo= true
                                const InfosPerfilUserPesquisado = Users.data().InfosPerfil
                    
                                if(oqFazerComUser == 'Remover Dos Seguidores') {
                                    for(let c = 0; c < InfosPerfilUserPesquisado.Seguidores.length; c++) {
                                        if(InfosPerfilUserPesquisado.Seguidores[f] == currentUser.User.Email) {
                                            InfosPerfilUserPesquisado.Seguidores.splice(f, 1)
                                        }
                                    }
                                    
                                } else if(oqFazerComUser == 'Adicionar Nos Seguidores') {
                                    InfosPerfilUserPesquisado.Seguidores.push(currentUser.User.Email)
                                }
                                
                                setTimeout(() => {
                                    db.collection('Users').doc(Users.id).update({ InfosPerfil: InfosPerfilUserPesquisado })
                                }, 500)
                            }
                        })
                    })
                })
            })
        }
    }

    //? Vai retonar a fila de músicas
    const containerMusicaslistaTelaTocandoAgora = document.getElementById('containerMusicaslistaTelaTocandoAgora')
    containerMusicaslistaTelaTocandoAgora.innerHTML = ''
    
    const infoLista = document.getElementById('infoLista')
    if(ListaProxMusica.Musicas.length - parseInt(ListaProxMusica.Numero) > 0) {
        let max = 4

        if(ListaProxMusica.Musicas.length - parseInt(ListaProxMusica.Numero) < 4) {
            max = ListaProxMusica.Musicas.length - parseInt(ListaProxMusica.Numero)
        }

        infoLista.innerText = 'A seguir'

        for(let c = 1; c < max; c++) {
            RetornarMusicas(ListaProxMusica.Musicas[parseInt(ListaProxMusica.Numero) + c].NomeMusica, containerMusicaslistaTelaTocandoAgora, 'Indeterminado', 'Linha', false, false, 'SemScroll')
        } 

    } else {
        infoLista.innerText = 'Sua lista está vazia'
    }
}

//? Ao clicar na música tocando agora na barra tela música tocando agora, vai abir a aba mostrando todas as músicas do autor
document.getElementById('containerMusicaTelaTocanAgora').addEventListener('click',() => {
    FecharPaginas()
    const imgPerfilArtista = document.getElementById('imgPerfilArtista')
    if(infoMusicaTocandoAgora.LinkImg.includes ('treefy')) {
      imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
    } else {
      imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
    }
    imgPerfilArtista.src = infoMusicaTocandoAgora.LinkImg
    document.getElementById('NomeArtista').innerText = infoMusicaTocandoAgora.Autor
    document.getElementById('containerMusicasArtista').innerHTML = ''
    document.querySelector('body').style.overflow = 'hidden'
    RetornarMusicasArtista(infoMusicaTocandoAgora.Autor, document.getElementById('containerMusicasArtista'))
    SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
    coletarHistorico(infoMusicaTocandoAgora.Autor, 'Autor')
})

//? Vai abrir a página do user que postou a música ao clicar no perfil dele da tela música tocando agora
document.getElementById('SobreQuemPostou').addEventListener('click', (e) => {
    let el = e.target
    if(el.id == 'btnSeguirUserTelaTocandoAgora') {
        for(let c = 0; c < TodosOsUsers.length; c++) {
            if(infoMusicaTocandoAgora.EmailUser == TodosOsUsers[c].User.Email) {
                AbrirPerfilOutroUser(TodosOsUsers[c].User)
                carregarUserArtistasSeguidos()
            }
        }
    } else if(document.getElementById('PagPerfilOutroUser').style.display != 'block'){
        for(let c = 0; c < TodosOsUsers.length; c++) {
            if(infoMusicaTocandoAgora.EmailUser == TodosOsUsers[c].User.Email) {
                AbrirPerfilOutroUser(TodosOsUsers[c].User)
            }
        }
    }
})

let ultimoNomeAbirTelaTocandoAgora
function AbrirTelaTocandoAgora(Nome) {
    const TelaTocandoAgora = document.getElementById('TelaTocandoAgora')

    if(Nome == 'OpenViaBtn') {
        if(TelaTocandoAgora.classList == 'TelaTocandoAgoraOpen') {
            TelaTocandoAgora.classList.remove('TelaTocandoAgoraOpen')

        } else {
            TelaTocandoAgora.classList.add('TelaTocandoAgoraOpen')
            ultimoNomeAbirTelaTocandoAgora = Nome
        }
    } else if(ultimoNomeAbirTelaTocandoAgora != Nome) {
        TelaTocandoAgora.classList.add('TelaTocandoAgoraOpen')
        ultimoNomeAbirTelaTocandoAgora = Nome
    }
} 

function FecharTelaTocandoAgora() {
    const TelaTocandoAgora = document.getElementById('TelaTocandoAgora')
    TelaTocandoAgora.classList.remove('TelaTocandoAgoraOpen')
}

//? Vai retornar as playlists
let arrayMusicasPlaylist = []
function RetornarPlayList(Pesquisa, Local, Formato = 'Caixa', ID = null) {
    let PesquisaFormatada = formatarTexto(Pesquisa)
    let contadorMusicasLinha = 0
    
    const section = document.createElement('section')
    section.className = 'containerPlaylistsCaixa'
    const TituloPlaylist = document.createElement('h1')
    TituloPlaylist.innerText = 'PlayLists'
    const articleContainer = document.createElement('article')
    articleContainer.className = 'articleContainer'
    const article = document.createElement('article')

    for(let c = 0; c < TodasMusicas.Playlists.length; c++) {
        let NomePlaylist = formatarTexto(TodasMusicas.Playlists[c].Nome)
        let PesquisaPassou = false //? Caso a playlist cumpra os requisitos da pesquisa

        if(ID == null) {
            if(PesquisaFormatada.includes(NomePlaylist) || NomePlaylist.includes(PesquisaFormatada)) {
                PesquisaPassou = true
            }
        } else {
            if(TodasMusicas.Playlists[c].ID == ID && !PesquisaPassou) {
                PesquisaPassou = true
            }
        }

        if(PesquisaPassou) {
            if(TodasMusicas.Playlists[c].Estado == 'Pública') {
                if(Formato == 'Caixa') {
                    const container = document.createElement('div')
                    const containerImg = document.createElement('div')
                    const img = document.createElement('img')
                    const TextoMusicaCaixa = document.createElement('div')
                    const p = document.createElement('p')
                    const span = document.createElement('span')

                    container.className = 'containerPlaylists'
                    containerImg.className = 'containerImgPlaylist'
                    TextoMusicaCaixa.className = 'TextoMusicaCaixa'

                    img.src = TodasMusicas.Playlists[c].Musicas[0].LinkImg
                    p.innerText = TodasMusicas.Playlists[c].Nome

                    let userDonoDaPlaylist
                    for(let i = 0; i < TodosOsUsers.length; i++) {
                        if(TodosOsUsers[i].User.Email == TodasMusicas.Playlists[c].EmailUser) {
                            span.innerText = `De ${TodosOsUsers[i].User.Nome}`
                            userDonoDaPlaylist = TodosOsUsers[i]
                        }
                    }

                    containerImg.appendChild(img)
                    container.appendChild(containerImg)
                    TextoMusicaCaixa.appendChild(p)
                    TextoMusicaCaixa.appendChild(span)
                    container.appendChild(TextoMusicaCaixa)

                    article.appendChild(container)

                    //? Ao clicar no nome do user
                    span.addEventListener('click', () => {
                        AbrirPerfilOutroUser(userDonoDaPlaylist.User)
                    })

                    //? Vai abrir a playlist
                    container.addEventListener('click', (e) => {
                        let el = e.target

                        if(el != span) {
                            AbrirPlaylist(TodasMusicas.Playlists[c])
                        }

                    })

                } else if(Formato == 'Linha') {
                    arrayMusicasPlaylist = []

                    for(let i = TodasMusicas.Playlists[c].Musicas.length -1; i >= 0; i--) {
                        arrayMusicasPlaylist.push(TodasMusicas.Playlists[c].Musicas[i])
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
                        img.src = TodasMusicas.Playlists[c].Musicas[i].LinkImg
                        if(img.src.includes('treefy')) {
                            divImg.classList.add('DivImgMusicaMeuPerfil', 'DivImgMusicaMeuPerfilTreeFy')
                        } else {
                            divImg.classList.add('DivImgMusicaMeuPerfil')
                        }
                
                        Nome.innerText = TodasMusicas.Playlists[c].Musicas[i].NomeMusica
                        AutorDaMusica.innerText = TodasMusicas.Playlists[c].Musicas[i].Autor
                        Genero.innerText = TodasMusicas.Playlists[c].Musicas[i].Genero
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
                                AbrirTelaTocandoAgora(Pesquisa)

                                ListaProxMusica = {
                                    Musicas: arrayMusicasPlaylist,
                                    Numero: i,
                                }
                                DarPlayMusica(TodasMusicas.Playlists[c].Musicas[i], i)
                            }
                        })
                
                        FavoritarDesfavoritarMusica(TodasMusicas.Playlists[c].Musicas.ID, 'Checar').then((resolve) => {
                            Heart.src = resolve
                        })
                
                        Heart.addEventListener('click', () => {
                            FavoritarDesfavoritarMusica(TodasMusicas.Playlists[c].Musicas.ID, 'Editar').then((resolve) => {
                                Heart.src = resolve
                            })
                        })
                
                        AutorDaMusica.addEventListener('click', () => {
                            FecharPaginas()
                            const imgPerfilArtista = document.getElementById('imgPerfilArtista')
                            if(img.src.includes ('treefy')) {
                                imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
                            } else {
                                imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
                            }
                            imgPerfilArtista.src = img.src
                            document.getElementById('NomeArtista').innerText = AutorDaMusica.innerText
                            document.getElementById('containerMusicasArtista').innerHTML = ''
                            document.querySelector('body').style.overflow = 'hidden'
                            RetornarMusicasArtista(AutorDaMusica.innerText, document.getElementById('containerMusicasArtista'))
                            SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))
                            coletarHistorico(AutorDaMusica.innerText, 'Autor')
                        })
                    }
                }
            }
        }
    }

    if(article.innerHTML != '') {
        if(Formato == 'Caixa') {
            section.appendChild(TituloPlaylist)
        } else {
            section.className = 'containerMusica'
        }
        articleContainer.appendChild(article)
        section.appendChild(articleContainer)
        Local.appendChild(section)
    }

}

//? Vai abrir a playlist selecionada
function AbrirPlaylist(Playlist) {
    FecharPaginas()
    const imgPerfilPagPlaylist = document.getElementById('imgPerfilPagPlaylist')
    if(Playlist.Musicas[0].LinkImg.includes ('treefy')) {
        imgPerfilPagPlaylist.classList.add('imgPerfilPagPlaylistTreeFy')
    } else {
        imgPerfilPagPlaylist.classList.remove('imgPerfilPagPlaylistTreeFy')
    }

    imgPerfilPagPlaylist.src = Playlist.Musicas[0].LinkImg
    document.getElementById('NomePagPlaylist').innerText = Playlist.Nome
    
    if(Playlist.Descricao.trim() != '') {
        document.getElementById('descPlaylist').innerText = Playlist.Descricao
    }

    document.getElementById('containerMusicasPagPlaylist').innerHTML = ''
    document.querySelector('body').style.overflow = 'hidden'

    // RetornarMusicasPagPlaylist(span.innerText, document.getElementById('containerMusicasPagPlaylist'))
    RetornarPlayList('', document.getElementById('containerMusicasPagPlaylist'), 'Linha', Playlist.ID)
    
    // SalvarHistoricoDePaginas(document.getElementById('PagPagPlaylist'))
    // coletarHistorico(span.innerText, 'Autor')

    const PagPlaylist = document.getElementById('PagPlaylist')
    PagPlaylist.style.display = 'block'
}

//? Vai dar play na playlist ao clicar no btn start
document.getElementById('btnPlayHeaderPagPlaylist').addEventListener('click', () => {
    AbrirTelaTocandoAgora(arrayMusicasPlaylist[0])

    ListaProxMusica = {
        Musicas: arrayMusicasPlaylist,
        Numero: 0,
    }
    
    DarPlayMusica(arrayMusicasPlaylist[0], 0)
})