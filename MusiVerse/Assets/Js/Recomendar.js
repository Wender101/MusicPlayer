function ordernarArray(words) {
    const wordCounts = new Map()
    for (const word of words) {
      if (wordCounts.has(word)) {
        wordCounts.set(word, wordCounts.get(word) + 1)
      } else {
        wordCounts.set(word, 1)
      }
    }
    const sortedWordCounts = Array.from(wordCounts.entries()).sort((a, b) => b[1] - a[1])
    const sortedWords = sortedWordCounts.map(([word, _]) => word)
    return sortedWords
}  

//? Vai esperar o user trocar de música para salvar as informações da música anterior
let salvarHistoricoNoBanco = false
let GostoMusicalHistorico = {
  Autores: [],
  Genero: [],
  Historico: {
    Musicas: [],
    Autores: [],
    Playlists: [],
    Users: [],
  }
}

function carregarHistorico() {
  let feito = false
  try {
    if(currentUser.User.GostoMusical.Historico) {
      feito = true
      GostoMusicalHistorico = currentUser.User.GostoMusical
      RecomendarMusicasHistorico()

    } else {
      GostoMusicalHistorico = {
        Autores: currentUser.User.GostoMusical.Autores,
        Genero: currentUser.User.GostoMusical.Genero,
        Historico: {
          Musicas: [],
          Autores: [],
          Playlists: [],
          Users: [],
        }
      }
    }

  } catch(r){
    // console.warn(r)

    if(feito == false) {
      setTimeout(() => {
        carregarHistorico()
      }, 1000)
    }
  }

  // console.log('carregarHistorico')
} carregarHistorico()

function coletarHistorico(Dados, Tipo = 'Música') {
  // console.log('Coletar dados foi chamado')

  if(salvarHistoricoNoBanco == false) {
    salvarHistoricoNoBanco = true

    setTimeout(() => {
      salvarHistoricoNoBanco = false
    }, 2000)

    if(Tipo == 'Música') {
      let feito = false
      try {
        for(let c = 0; c < GostoMusicalHistorico.Historico.Musicas.length; c++) {
          if(GostoMusicalHistorico.Historico.Musicas[c].NomeMusica.trim() == Dados.trim()) {
            feito == true
            GostoMusicalHistorico.Historico.Musicas.splice(c, 1)
          }
        }

      } catch{}
      
      if(GostoMusicalHistorico.Historico.Musicas.length >= 20 && !feito) {
        feito = true
        GostoMusicalHistorico.Historico.Musicas.splice(0, 1)
      }
      
      GostoMusicalHistorico.Historico.Musicas.push(Dados)

    } else if(Tipo == 'Playlist') {
      let feito = false
      try {
        for(let c = 0; c < GostoMusicalHistorico.Historico.Playlists.length; c++) {
          if(GostoMusicalHistorico.Historico.Playlists[c].trim() == Dados.trim()) {
            feito == true
            GostoMusicalHistorico.Historico.Playlists.splice(c, 1)
          }
        }

        if(GostoMusicalHistorico.Historico.Playlists.length >= 20 && !feito) {
          feito = true
          GostoMusicalHistorico.Historico.Playlists.splice(0, 1)
        }
      } catch{}
  
      GostoMusicalHistorico.Historico.Playlists.push(Dados)

    } else if(Tipo == 'Autor') {
      let feito = false
      try {
        for(let c = 0; c < GostoMusicalHistorico.Historico.Autores.length; c++) {
          if(GostoMusicalHistorico.Historico.Autores[c].trim() == Dados.trim()) {
            feito == true
            GostoMusicalHistorico.Historico.Autores.splice(c, 1)
          }
        }

      } catch{}
      
      if(GostoMusicalHistorico.Historico.Autores.length >= 20 && !feito) {
        feito = true
        GostoMusicalHistorico.Historico.Autores.splice(0, 1)
      }

      GostoMusicalHistorico.Historico.Autores.push(Dados)
    }

    currentUser.User.GostoMusical.Historico = GostoMusicalHistorico.Historico
    db.collection('Users').doc(currentUser.User.Id).update({GostoMusical: currentUser.User.GostoMusical}).then(() => {
    })
    RecomendarAutoresPlaylistsHistorico()
  }
}

function RecomendarMusicasHistorico() {
  let HistoricoOrdenado = GostoMusicalHistorico.Historico.Musicas.slice().sort((a, b) => b.Tempo - a.Tempo) // Vai ordenar o array de acordo com o tempo em ordem decrescente
  let HistoricoDeMusicas = []

  for (let b = 0; b < HistoricoOrdenado.length; b++) {
    for (let c = 0; c < TodasMusicas.Musicas.length; c++) {
      if (HistoricoOrdenado[b].Musica == TodasMusicas.Musicas[c].ID) {
        HistoricoDeMusicas.push(TodasMusicas.Musicas[c])
      }
    }
  }

  // Encontrar os autores que mais se repetem
  const autorFrequencia = {}
  HistoricoDeMusicas.forEach((item) => {
    const autor = item.Autor
    if (autorFrequencia[autor]) {
      autorFrequencia[autor]++
    } else {
      autorFrequencia[autor] = 1
    }
  })

  // Encontrar os gêneros que mais se repetem
  const generoFrequencia = {}
  HistoricoDeMusicas.forEach((item) => {
    const generos = item.Genero.split(', ')
    generos.forEach((genero) => {
      if (generoFrequencia[genero]) {
        generoFrequencia[genero]++
      } else {
        generoFrequencia[genero] = 1
      }
    })
  })

  // Encontrar os autores mais repetidos
  const autoresMaisRepetidos = Object.keys(autorFrequencia).sort((a, b) => autorFrequencia[b] - autorFrequencia[a])

  // Encontrar os gêneros mais repetidos
  const generosMaisRepetidos = Object.keys(generoFrequencia).sort((a, b) => generoFrequencia[b] - generoFrequencia[a])

  // console.log("Autores mais repetidos:", autoresMaisRepetidos)
  // console.log("Gêneros mais repetidos:", generosMaisRepetidos)


  //? Vai recomendar os artitas mais ouvidos de acordo com seu historico
  ArtistasMaisOuvidosHistorico(autoresMaisRepetidos)
  RecomendarGeneros(generosMaisRepetidos)
  RecomendarAutoresPlaylistsHistorico()
  randomMusics()
}

function ArtistasMaisOuvidosHistorico(Artistas) {
  const article = document.createElement('article')
  article.className = 'containerMusicasOverflow'

  for(let c = 0; c < Artistas.length; c++) {
    let artistaEncontrado = false
    for(let b = 0; b < TodasMusicas.Musicas.length; b++) {

      if(formatarTexto(Artistas[c]) == formatarTexto(TodasMusicas.Musicas[b].Autor) && artistaEncontrado == false) {
        artistaEncontrado = true

        const div = document.createElement('div')
        const containerImg = document.createElement('div')
        const img = document.createElement('img')
        const divTexto = document.createElement('div')
        const darPlay = document.createElement('div')
        const p = document.createElement('p')
        const span = document.createElement('span')
        const divBlurTexto = document.createElement('div')

        article.className = 'containerMusicaCaixa'
        div.classList.add('MusicasCaixa', 'ArtistaHistorico')
        div.title = TodasMusicas.Musicas[b].NomeMusica

        darPlay.className = 'BtnDarPlay'
        darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`

        img.src = TodasMusicas.Musicas[b].LinkImg
        if(img.src.includes('treefy')) {
          containerImg.classList.add('ContainerImgMusicaCaixa', 'ContainerImgArtistaHistoricoTreeFy')
        } else {
          containerImg.classList.add('ContainerImgMusicaCaixa')
        }

        divTexto.className = 'TextoMusicaCaixa'
        p.innerText = TodasMusicas.Musicas[b].Autor
        span.innerText = 'Artista'
        divBlurTexto.className = 'divBlurTexto2'
        divBlurTexto.innerHTML = `<img src="${TodasMusicas.Musicas[b].LinkImg}">`

        divTexto.appendChild(p)
        divTexto.appendChild(span)

        const corAleatoria = `#${((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0')}`
        // let corSVG = corAleatoria
        let corSVG = 'rgba(0, 255, 255, 0.726)'
        containerImg.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="194" height="71" viewBox="0 0 194 71" fill="none" class="svgTop">
            <path d="M0 0H194C194 0 179.737 13.3146 165.471 18.9076C126.202 34.3024 77.7427 8.48913 42.7941 8.48913C0.738899 8.48913 0 71 0 71V0Z" fill="${corSVG}"/>
        </svg>
        
        <svg xmlns="http://www.w3.org/2000/svg" width="255" height="24" viewBox="0 0 255 24" fill="none" class="svgBottom">
            <path d="M0 0.499948C0 0.499948 16.1348 0.345708 27 0.499946C74.7217 1.17738 102.147 8.89486 149.5 12.548C190.645 15.7221 247.392 -12.2381 254.443 12.548C255.697 16.9552 254.443 24 254.443 24H0V0.499948Z" fill="${corSVG}"/>
        </svg>`

        div.appendChild(darPlay)
        containerImg.appendChild(img)
        div.appendChild(containerImg)
        div.appendChild(divBlurTexto)
        div.appendChild(divTexto)
        article.appendChild(div)

        //? Ao clicar no nome do Autor
        div.addEventListener('click', () => {
          AbrirPerfilArtista(TodasMusicas.Musicas[b])
        })
      }
    }
  }

  const h1 = document.createElement('h1')
  const section = document.createElement('section')
  const articleContainer = document.createElement('article')

  //? Vai adicionar o article no html apenas se houver algunma música
  if(article.innerHTML != '') {
    h1.innerText = `Sujestão de artistas`
    section.className = 'containerMusica'
    section.appendChild(h1)
    articleContainer.className = 'articleContainer'
    articleContainer.appendChild(article)
    section.appendChild(articleContainer)
    document.getElementById('containerMain').appendChild(section)
  }

  //? Scroll lateral
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

  let scrollStep = section.scrollWidth // Ajuste a velocidade de rolagem conforme necessário.
  let contadorScroll = 0
  function handleResize() {
      scrollStep = section.scrollWidth
      checkScrollLimit()

      // Verifique se o conteúdo é maior do que a tela
      if (articleContainer.scrollWidth > section.scrollWidth) {
          // Se for maior, mostre o botão
          divBtnsScrollHorizontal.style.display = 'flex'
      } else {
          divBtnsScrollHorizontal.style.display = 'none'
      }
  }
  // Adicionar um ouvinte de evento de redimensionamento à janela
  window.addEventListener('resize', handleResize)
  // Inicialização - opcional
  handleResize() // Para registrar o tamanho inicial da tela

  btnBackScrollHorizontal.addEventListener('click', () => {
      // Rode a rolagem suave
      articleContainer.scrollLeft -= scrollStep
      contadorScroll--
      checkScrollLimit()
  })

  btnNextScrollHorizontal.addEventListener('click', () => {
      // Rode a rolagem suave
      articleContainer.scrollLeft += scrollStep
      contadorScroll++
      checkScrollLimit()
  })

  // Função para verificar e ajustar a opacidade dos botões com base no limite de rolagem
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
  // Verifique os limites iniciais
  checkScrollLimit()
}

let containerMain = document.getElementById('containerMain')
function RecomendarGeneros(Generos) {
  // containerMain.innerHTML = ''
  for(let c = 0; c < Generos.length && c < 5; c++) {
    RetornarMusicas(Generos[c], containerMain)
  }
}

//? Vai recomendar os autores e as palylists vistas por ultimo no histórico
function RecomendarAutoresPlaylistsHistorico() {
  // Suponhamos que você tenha as duas arrays Autores e Playlists
  let Autores = GostoMusicalHistorico.Historico.Autores
  let Playlists = GostoMusicalHistorico.Historico.Playlists

  const articleContainerPlaylistFavoritaPerfil = document.getElementById('articleContainerPlaylistFavoritaPerfil')
  articleContainerPlaylistFavoritaPerfil.innerHTML = '<div class="containerPlaylistFavoritaPerfil" id="musicasFavoritasPerfil" onclick="abrirFavoritosBtnNoHome()"><img src="Assets/Imgs/Icons/Img Músicas Curtidas.png"><p>Músicas Curtidas</p><div class="iconPlayPlaylistFavoritaPerfil"></div></div>'
  let maxRetornosAutor = 3
  let maxRetornosPlaylist = 3

  if(Autores.length < maxRetornosAutor) {
    maxRetornosPlaylist = 5 - Autores.length
  } else if(Playlists.length < maxRetornosPlaylist) {
    maxRetornosAutor = 5 - Playlists.length
  }

  for(let c = 0; c < Autores.length && c < maxRetornosAutor; c++) {
    RetornarAutorPlaylistVistaPorUltimo(Autores[Autores.length - (c + 1)], 'Autor')
  }

  for(let c = 0; c < Playlists.length && c < maxRetornosPlaylist; c++) {
    RetornarAutorPlaylistVistaPorUltimo(Playlists[Playlists.length - (c + 1)], 'Playlist')
  }

  function RetornarAutorPlaylistVistaPorUltimo(Pesquisa, Tipo) {
    let Feito = false
    
    if(Tipo == 'Autor') {
      for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
        if(TodasMusicas.Musicas[c].Autor.trim() == Pesquisa.trim() && Feito == false) {
          Feito = true
          const containerPlaylistFavoritaPerfil = document.createElement('div')
          containerPlaylistFavoritaPerfil.className = 'containerPlaylistFavoritaPerfil'
          const imgCapa = document.createElement('img')
          const nome = document.createElement('p')
          const iconPlayPlaylistFavoritaPerfil = document.createElement('div')
          iconPlayPlaylistFavoritaPerfil.className = 'iconPlayPlaylistFavoritaPerfil'
          
          imgCapa.src = TodasMusicas.Musicas[c].LinkImg

          if(!imgCapa.src.includes('treefy')) {
            imgCapa.style.height = '138%'
          }

          nome.innerText = TodasMusicas.Musicas[c].Autor
          
          containerPlaylistFavoritaPerfil.appendChild(imgCapa)
          containerPlaylistFavoritaPerfil.appendChild(nome)
          containerPlaylistFavoritaPerfil.appendChild(iconPlayPlaylistFavoritaPerfil)
          articleContainerPlaylistFavoritaPerfil.appendChild(containerPlaylistFavoritaPerfil)

          containerPlaylistFavoritaPerfil.addEventListener('click', () => {
            AbrirPerfilArtista(TodasMusicas.Musicas[c])
          })

           containerPlaylistFavoritaPerfil.addEventListener('contextmenu', function (e) {
                e.preventDefault()
                const containerOptionsClickArtista = document.getElementById('containerOptionsClickArtista')
                autorSelecionadoBtnDireito = TodasMusicas.Musicas[c]
                // Position the custom menu at the mouse coordinates
                containerOptionsClickArtista.style.left = e.clientX+ 'px'
                containerOptionsClickArtista.style.top = e.clientY + 'px'
                containerOptionsClickArtista.style.display = 'block'

                // Close the menu when clicking outside of it
                document.addEventListener('click', hideMenu)

                document.addEventListener('scroll', hideMenu)
            })

            function hideMenu() {
                document.getElementById('containerOptionsClickMusic').style.display = 'none'
                document.getElementById('containerOptionsClickArtista').style.display = 'none'
                document.removeEventListener('scroll', hideMenu)
            }
        }
      }
    }
  }
}

function randomMusics() {
  try {
    const imgMusicasAleatoriasBanner = document.getElementsByClassName('imgMusicasAleatoriasBanner')

    for (let i = 0; i < imgMusicasAleatoriasBanner.length; i++) {
      const numSorteado = [Math.floor(Math.random() * TodasMusicas.Musicas.length)]
      const urlAleatoria = TodasMusicas.Musicas[numSorteado]

      if(urlAleatoria.LinkImg.includes('treefy')) {
        imgMusicasAleatoriasBanner[i].classList.add('imgMusicasAleatoriasBannerTreeFy')
      } else {
        imgMusicasAleatoriasBanner[i].classList.remove('imgMusicasAleatoriasBannerTreeFy')
      }

      imgMusicasAleatoriasBanner[i].src = urlAleatoria.LinkImg

      imgMusicasAleatoriasBanner[i].addEventListener('click', () => {
        ListaProxMusica = {
          Musicas: TodasMusicas.Musicas,
          Numero: numSorteado,
        }
        DarPlayMusica(urlAleatoria, numSorteado)
      })
    }
  } catch (error) {
    console.error(error)
  }
}