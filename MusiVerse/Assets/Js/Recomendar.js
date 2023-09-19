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
let historicoMusicasOuvidas = []

function carregarHistorico() {
  let feito = false
  try {
    if(currentUser.User.GostoMusical.Historico) {
      feito = true
      historicoMusicasOuvidas = currentUser.User.GostoMusical.Historico
      RecomendarMusicasHistorico()
    }
  } catch(r){
    if(feito == false) {
      setTimeout(() => {
        carregarHistorico()
      }, 1000)
    }
  }

  console.log('carregarHistorico');
} carregarHistorico()

function coletarHistorico(Dados) {
  if(salvarHistoricoNoBanco == false) {
    salvarHistoricoNoBanco = true

    setTimeout(() => {
      salvarHistoricoNoBanco = false
    }, 2000)

    if(historicoMusicasOuvidas.length >= 20) {
      historicoMusicasOuvidas.splice(0, 1)
    }

    historicoMusicasOuvidas.push(Dados)
    console.log(historicoMusicasOuvidas)
    currentUser.User.GostoMusical.Historico = historicoMusicasOuvidas
    db.collection('Users').doc(currentUser.User.Id).update({GostoMusical: currentUser.User.GostoMusical})
  }
}

function RecomendarMusicasHistorico() {
  let HistoricoOrdenado = historicoMusicasOuvidas.slice().sort((a, b) => b.Tempo - a.Tempo); // Vai ordenar o array de acordo com o tempo em ordem decrescente
  let HistoricoDeMusicas = [];

  for (let b = 0; b < HistoricoOrdenado.length; b++) {
    for (let c = 0; c < TodasMusicas.length; c++) {
      if (HistoricoOrdenado[b].Musica == TodasMusicas[c].Id) {
        HistoricoDeMusicas.push(TodasMusicas[c]);
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

  console.log("Autores mais repetidos:", autoresMaisRepetidos)
  console.log("Gêneros mais repetidos:", generosMaisRepetidos)


  //? Vai recomendar os artitas mais ouvidos de acordo com seu historico
  ArtistasMaisOuvidosHistorico(autoresMaisRepetidos)
}

function ArtistasMaisOuvidosHistorico(Artistas) {
  const article = document.createElement('article')
  article.className = 'containerMusicasOverflow'

  for(let c = 0; c < Artistas.length; c++) {
    let artistaEncontrado = false
    for(let b = 0; b < TodasMusicas.length; b++) {

      if(Artistas[c] == TodasMusicas[b].Autor && artistaEncontrado == false) {
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
        div.title = TodasMusicas[b].NomeMusica

        darPlay.className = 'BtnDarPlay'
        darPlay.style.backgroundImage = `url(./Assets/Imgs/Icons/DarPlay.png)`

        img.src = TodasMusicas[b].LinkImg
        if(img.src.includes('treefy')) {
            containerImg.classList.add('ContainerImgMusicaCaixa', 'ContainerImgArtistaHistoricoTreeFy')
        } else {
            containerImg.classList.add('ContainerImgMusicaCaixa')
        }

        divTexto.className = 'TextoMusicaCaixa'
        p.innerText = TodasMusicas[b].Autor
        span.innerText = 'Artista'
        divBlurTexto.className = 'divBlurTexto'

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
          FecharPaginas()
          document.getElementById('imgPerfilArtista').style.backgroundImage = `url(${img.src})`
          document.getElementById('NomeArtista').innerText = p.innerText
          document.getElementById('containerMusicasArtista').innerHTML = ''
          document.querySelector('body').style.overflow = 'hidden'
          RetornarMusicasArtista(p.innerText, document.getElementById('containerMusicasArtista'))
          const PagArtistas = document.getElementById('PagArtistas')
          PagArtistas.style.display = 'block'
        })
      }
    }
  }

  const h1 = document.createElement('h1')
  const section = document.createElement('section')

  //? Vai adicionar o article no html apenas se houver algunma música
  if(article.innerHTML != '') {
      h1.innerText = `Artistas ouvidos recentemente`
      section.className = 'containerMusica'
      section.appendChild(h1)
      section.appendChild(article)
      document.getElementById('containerMain').appendChild(section)
  }
}