const containerMusicasAddCriarPlaylist = document.getElementById('containerMusicasAddCriarPlaylist').querySelector('section').querySelector('article')

//? Adicionar músicas a playlist
let arrayMusicasNovaPlaylist = []
function PesquisarMusicaCriarPlaylist() {
    const pesquisarMuiscaCriarPlaylist = document.getElementById('pesquisarMuiscaCriarPlaylist')
    const PesquisaFormatada = formatarTexto(pesquisarMuiscaCriarPlaylist.value)
    const Local = document.getElementById('containerMusicasPesquisadasCriarPlaylist')
    Local.innerHTML = ''
    const article = document.createElement('article')
    article.className = 'containerMusicasOverflow'
    let contadorMusicas = 0
    
    if(pesquisarMuiscaCriarPlaylist.value.trim() != '') {
        Local.style.display = 'block'
        for(let c = 0; c < TodasMusicas.length; c++) {
            const NomeMusica = formatarTexto(TodasMusicas[c].NomeMusica)
            const Autor = formatarTexto(TodasMusicas[c].Autor)
            const Genero = formatarTexto(TodasMusicas[c].Genero)
    
            if(contadorMusicas < 12) {
                if (PesquisaFormatada.includes(NomeMusica) || PesquisaFormatada.includes(Autor) || PesquisaFormatada.includes(Genero) || NomeMusica.includes(PesquisaFormatada) || Autor.includes(PesquisaFormatada) || Genero.includes(PesquisaFormatada)
                ) {
                    contadorMusicas++
                    article.className = 'containerMusicaLinha'
        
                    const div = document.createElement('div')
                    const divPrimeiraParte = document.createElement('div')
                    const divImg = document.createElement('div')
                    const img = document.createElement('img')
                    const divTexto = document.createElement('div')
                    const Nome = document.createElement('p')
                    const AutorDaMusica = document.createElement('span')
                    const Genero = document.createElement('p')
                    const btnAdicionar = document.createElement('button')
        
                    div.className = 'MusicasLinha'
                    divTexto.className = 'TextoMusicaCaixa'
                    btnAdicionar.className = 'btnAdicionar'
                    divImg.className = 'DivImgMusicaMeuPerfil'
                    img.className = 'ImgMusicaMeuPerfil'
                    Genero.className = 'GeneroMeuPerfil'
                    img.src = TodasMusicas[c].LinkImg
                    Nome.innerText = TodasMusicas[c].NomeMusica
                    AutorDaMusica.innerText = TodasMusicas[c].Autor
                    Genero.innerText = TodasMusicas[c].Genero
                    btnAdicionar.innerText = 'Adicionar'
                    
                    divTexto.appendChild(Nome)
                    divTexto.appendChild(AutorDaMusica)
                    divImg.appendChild(img)
                    divPrimeiraParte.appendChild(divImg)
                    divPrimeiraParte.appendChild(divTexto)
                    div.appendChild(divPrimeiraParte)
                    div.appendChild(Genero)
                    div.appendChild(btnAdicionar)
                    article.appendChild(div)
        
                    div.addEventListener('click', (event) => {
                        if (event.target != AutorDaMusica && event.target != btnAdicionar) {
                            ListaProxMusica = {
                                Musicas: TodasMusicas[c],
                                Numero: c,
                            }
        
                            DarPlayMusica(TodasMusicas[c], c)
                        }
                    })
        
                    //? Vai adicionar a música na playlist
                    let clicouAdd = false
                    const btnPostarPlaylist = document.getElementById('btnPostarPlaylist')
                    btnAdicionar.addEventListener('click', () => {
                        const imgCriarPlaylist = document.getElementById('imgCriarPlaylist')
    
                        if(clicouAdd == false) {
                            arrayMusicasNovaPlaylist.push(TodasMusicas[c])
                            clicouAdd = true
                            containerMusicasAddCriarPlaylist.appendChild(div)
                            btnAdicionar.innerText = 'Remover'
                        } else {
                            for(let b = 0; b < arrayMusicasNovaPlaylist.length; b++) {
                                if(arrayMusicasNovaPlaylist[b].Id == TodasMusicas[c].Id) {
                                    arrayMusicasNovaPlaylist.splice(b, 1)
                                }
                            }
    
                            clicouAdd = false
                            containerMusicasAddCriarPlaylist.removeChild(div)
                        }
    
                        //? Vai mudar a foto da playlist
                        if(arrayMusicasNovaPlaylist.length > 0) {
                            imgCriarPlaylist.classList.add('PlaylistTemImg')
                            imgCriarPlaylist.src = arrayMusicasNovaPlaylist[0].LinkImg
                            btnPostarPlaylist.style.display = 'flex'
    
                        } else {
                            imgCriarPlaylist.classList.remove('PlaylistTemImg')
                            imgCriarPlaylist.src = 'Assets/Imgs/Icons/Faixas200.png'
                            btnPostarPlaylist.style.display = 'none'
                        }
                    })
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
    } else {
        Local.style.display = 'none'
    }
}

//? Cancelar Postar
const popUpAdicionarPlaylist = document.getElementById('popUpAdicionarPlaylist')
const inputNomeNovaPlaylist = document.getElementById('inputNomeNovaPlaylist')
const textareaDescricaoNovaPlaylist = document.getElementById('textareaDescricaoNovaPlaylist')
function CancelarPostarNovaPlaylist() {
    inputNomeNovaPlaylist.value = ''
    textareaDescricaoNovaPlaylist.value = ''
    popUpAdicionarPlaylist.style.display = 'none'
}

//? Vai abrir popup
function PopUpPostaNovaPlaylist() {
    popUpAdicionarPlaylist.style.display = 'flex'
}

//? Postar nova playlist
function PostarNovaPlaylist(btn) {
    if(inputNomeNovaPlaylist.value.trim() != '') {
        document.getElementById('postarNovaPlaylist').style.background = 'rgb(0, 255, 255)'

        if(btn) {
            let novaPlaylist = {
                Estado: 'Pública',
                EmailUser: currentUser.User.Email,
                Musicas: arrayMusicasNovaPlaylist,
                Nome: inputNomeNovaPlaylist.value,
                Descricao: textareaDescricaoNovaPlaylist.value,
                Colaboradores: [],
            }

            db.collection('Playlists').doc().set(novaPlaylist).then(() => {
                CancelarPostarNovaPlaylist()
                alert('Playlist postada com sucesso!')
                FecharPaginas()
                document.getElementById('containerMusicasPesquisadasCriarPlaylist').innerHTML = ''
                document.getElementById('containerMusicasAddCriarPlaylist').querySelector('section').querySelector('article').innerHTML = ''
                document.getElementById('pesquisarMuiscaCriarPlaylist').innerHTML = ''
                document.getElementById('imgCriarPlaylist').src = 'Assets/Imgs/Icons/Faixas200.png'
            })
        }
    } else {
        document.getElementById('postarNovaPlaylist').style.background = '#1F1F22'
    }

}