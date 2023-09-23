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
        document.getElementById('btnPesquisaMusicaPlaylist').src = 'Assets/Imgs/Icons/x.png'
        document.getElementById('btnPesquisaMusicaPlaylist').style.width = '17px'
        document.getElementById('btnPesquisaMusicaPlaylist').style.height = '17px'

        for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
            const NomeMusica = formatarTexto(TodasMusicas.Musicas[c].NomeMusica)
            const Autor = formatarTexto(TodasMusicas.Musicas[c].Autor)
            const Genero = formatarTexto(TodasMusicas.Musicas[c].Genero)
    
            if(contadorMusicas < 12) {
                if (PesquisaFormatada.includes(NomeMusica) || PesquisaFormatada.includes(Autor) || PesquisaFormatada.includes(Genero) || NomeMusica.includes(PesquisaFormatada) || Autor.includes(PesquisaFormatada) || Genero.includes(PesquisaFormatada)
                ) {
                    console.log(TodasMusicas.Musicas[c].EmailUser);
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
                    img.src = TodasMusicas.Musicas[c].LinkImg
                    Nome.innerText = TodasMusicas.Musicas[c].NomeMusica
                    AutorDaMusica.innerText = TodasMusicas.Musicas[c].Autor
                    Genero.innerText = TodasMusicas.Musicas[c].Genero
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
                                Musicas: TodasMusicas.Musicas[c],
                                Numero: c,
                            }
        
                            DarPlayMusica(TodasMusicas.Musicas[c], c)
                        }
                    })
        
                    //? Vai adicionar a música na playlist
                    let clicouAdd = false
                    const btnPostarPlaylist = document.getElementById('btnPostarPlaylist')
                    btnAdicionar.addEventListener('click', () => {
                        const imgCriarPlaylist = document.getElementById('imgCriarPlaylist')
    
                        if(clicouAdd == false) {
                            arrayMusicasNovaPlaylist.push(TodasMusicas.Musicas[c])
                            // Local.style.display = 'none'
                            clicouAdd = true
                            containerMusicasAddCriarPlaylist.appendChild(div)
                            btnAdicionar.innerText = 'Remover'
                        } else {
                            for(let b = 0; b < arrayMusicasNovaPlaylist.length; b++) {
                                if(arrayMusicasNovaPlaylist[b].ID == TodasMusicas.Musicas[c].ID) {
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
        document.getElementById('btnPesquisaMusicaPlaylist').src = 'Assets/Imgs/Icons/search.png'
        document.getElementById('btnPesquisaMusicaPlaylist').style.width = '20px'
        document.getElementById('btnPesquisaMusicaPlaylist').style.height = '20px'
    }

    document.getElementById('btnPesquisaMusicaPlaylist').addEventListener('click', () => {
        pesquisarMuiscaCriarPlaylist.value = ''
        PesquisarMusicaCriarPlaylist()
    })
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
    let feito = false
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

            db.collection('InfoMusicas').limit(1).get().then((snapshot) => {
                snapshot.docs.forEach(TodasAsMusicas => {
                    if(feito == false) {
                        feito = true
    
                        const InfoMusicasObj = TodasAsMusicas.data()
                        InfoMusicasObj.Playlists.push(novaPlaylist)
    
                        db.collection('InfoMusicas').doc(TodasAsMusicas.id).update({Playlists: InfoMusicasObj.Playlists}).then(() => {
                            CancelarPostarNovaPlaylist()
                            alert('Playlist postada com sucesso!')
                            FecharPaginas()
                            document.getElementById('containerMusicasPesquisadasCriarPlaylist').innerHTML = ''
                            document.getElementById('containerMusicasAddCriarPlaylist').querySelector('section').querySelector('article').innerHTML = ''
                            document.getElementById('pesquisarMuiscaCriarPlaylist').innerHTML = ''
                            document.getElementById('imgCriarPlaylist').src = 'Assets/Imgs/Icons/Faixas200.png'
                        })
                    }
                })
            })
        }
    } else {
        document.getElementById('postarNovaPlaylist').style.background = '#1F1F22'
    }

}