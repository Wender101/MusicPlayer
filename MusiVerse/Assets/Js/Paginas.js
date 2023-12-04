const linkPagina = document.getElementsByClassName('linkPagina')
const Paginas = document.getElementsByClassName('Paginas')
const Open = document.getElementsByClassName('Open')
let EventoNasPagsAdd = false

function FecharPaginas() {
    document.querySelector('body').style.overflow = 'auto'
    document.getElementById('inputPesquisa').value = ''

    for(let c = 0; c < Paginas.length; c++) {
        try {
            document.getElementsByClassName('Open')[c].classList.remove('Open')
        } catch{}
        
        document.getElementsByClassName('Paginas')[c].style.display = 'none'
    }

    for(let i = 0; i < linkPagina.length; i++) {
        document.getElementsByClassName('linkPagina')[i].style.color = '#fff'
        
        try {
            let img = document.getElementsByClassName('linkPagina')[i].querySelector('img')
            img.src = img.src.replace('Selected.png', '.png')
        } catch{}
    }
}

//? Vai dar um display none para o containerOptionsClickMusic ao scrollar as sections Paginas
const sectionPaginas = document.querySelectorAll('.Paginas')
sectionPaginas.forEach(pagians => {
    pagians.addEventListener('scroll', hideMenu)
})


//? Vai salvar o históco das páginas que foram abertas para o user poder voltar
let historiacoDasPaginas = {
    Paginas: [],
    PaginaAtual: null
}

const btnBackPag = document.getElementById('btnBackPag')
const btnNextPag = document.getElementById('btnNextPag')
function HistoricoPaginasAbertas(PaginaAberta) {
    //? --------------
    const index = historiacoDasPaginas.Paginas.indexOf(PaginaAberta)

    if (index !== -1) {
      // Se o valor já estiver presente, remova-o do array
      historiacoDasPaginas.Paginas.splice(index, 1)
    }

    let valorAntigo = historiacoDasPaginas.Paginas[historiacoDasPaginas.PaginaAtual]
      historiacoDasPaginas.Paginas.splice(historiacoDasPaginas.PaginaAtual, 1)
      historiacoDasPaginas.Paginas.push(valorAntigo)
  
    // Adicione o valor novamente ao final do array
    historiacoDasPaginas.Paginas.push(PaginaAberta)
    historiacoDasPaginas.PaginaAtual =  historiacoDasPaginas.Paginas.length -1
    //? -------------

    btnBackPag.classList.remove('btnBloqueado')
    btnNextPag.classList.add('btnBloqueado')
}

function VolatarPaginaAnterior() {
    if(historiacoDasPaginas.PaginaAtual > 0) {
        historiacoDasPaginas.PaginaAtual = historiacoDasPaginas.PaginaAtual - 1
        FecharPaginas()
        AbrirPaginas(historiacoDasPaginas.Paginas[historiacoDasPaginas.PaginaAtual])

        btnNextPag.classList.remove('btnBloqueado')
    } 
    
    if(historiacoDasPaginas.PaginaAtual <= 0) {
        btnBackPag.classList.add('btnBloqueado')
        AbrirPaginas(0)
    }
}

function ProxmaPagina() {
    if(historiacoDasPaginas.PaginaAtual < historiacoDasPaginas.Paginas.length -1) {

        historiacoDasPaginas.PaginaAtual = historiacoDasPaginas.PaginaAtual + 1
        FecharPaginas()
        AbrirPaginas(historiacoDasPaginas.Paginas[historiacoDasPaginas.PaginaAtual])
    
        btnBackPag.classList.remove('btnBloqueado')
    } 
    
    if(historiacoDasPaginas.PaginaAtual >= historiacoDasPaginas.Paginas.length -1) {
        btnNextPag.classList.add('btnBloqueado')
    }
}

function SalvarHistoricoDePaginas(idPagina = undefined, contadorLinkPagina) {
    
    if(idPagina == undefined) {
        for(let b = 0; b < Paginas.length; b++) {
            try {
                if(Paginas[b].id == removerEspacosEAcentos(`Pag${document.getElementsByClassName('linkPagina')[contadorLinkPagina].innerText}`)) {
                    AbrirPaginas(b, contadorLinkPagina)
                    VoltouAoHome(b)
                } else if(contadorLinkPagina == 0) {
                    const ultimoValor = historiacoDasPaginas.Paginas[historiacoDasPaginas.Paginas.length -1]
                    
                    historiacoDasPaginas = {
                        Paginas: [undefined, ultimoValor],
                        PaginaAtual: 0
                    }
                    
                    btnBackPag.classList.add('btnBloqueado')
                    btnNextPag.classList.remove('btnBloqueado')
                    AbrirPaginas(0)
                }
            } catch(e){console.warn(e)}
        }
    } else {
        idPagina = idPagina.id
        for(let c = 0; c < Paginas.length; c++) {
            if(idPagina == Paginas[c].id) {
                AbrirPaginas(c)
                VoltouAoHome(c)
            }
        }
    }
}

for(let c = 0; c < linkPagina.length; c++) {
    document.getElementsByClassName('linkPagina')[c].addEventListener('click', () => {
        SalvarHistoricoDePaginas(undefined, c)
    })
}

function VoltouAoHome(contador) {
    if(historiacoDasPaginas.Paginas[historiacoDasPaginas.PaginaAtual] == 0 && contador != 0 || historiacoDasPaginas.Paginas[historiacoDasPaginas.PaginaAtual] == undefined && contador != 0) {
        historiacoDasPaginas = {
            Paginas: [],
            PaginaAtual: null
        }
    }

    HistoricoPaginasAbertas(contador)
}

function AbrirPaginas(contadorPagina, contadorLinkPagina = undefined) {
    FecharPaginas()
    
    if(contadorPagina != 0) {
        setTimeout(() => {
        
            try {
                if(contadorLinkPagina != undefined) {
                    document.getElementsByClassName('linkPagina')[contadorLinkPagina].style.color = '#0FF'
                    let img = document.getElementsByClassName('linkPagina')[contadorLinkPagina].querySelector('img')
                    img.src = img.src.replace('.png', 'Selected.png')
                }
            } catch{}
        }, 100)
        
        try {
            document.getElementsByClassName(`Paginas`)[contadorPagina].style.display = 'block'
            document.querySelector('body').style.overflow = 'hidden'
        } catch{}
    } else {
        RecarregarHome()
    }
}

let recarregarPaginaFeito = false
function RecarregarHome() {
    if(!recarregarPaginaFeito) {
        recarregarPaginaFeito = true
        setTimeout(() => {
            recarregarPaginaFeito = false
        }, 1000)

        const containerMain = document.getElementById('containerMain')
        containerMain.innerHTML = ''
        RetornarMusicas('Aleatórias', containerMain)
        carregarHistorico()
    }
}

function removerEspacosEAcentos(texto) {
    texto = texto.replace(/\s/g, '')
    const acentos = 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÕÖØòóôõöøÙÚÛÜùúûüÝýÿÑñÇç'
    const naoAcentuados = 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOOooooooUUUUuuuuyyNnCc'
    const regExpAcentos = new RegExp(`[${acentos}]`, 'g')
    texto = texto.replace(regExpAcentos, (letra) => naoAcentuados.charAt(acentos.indexOf(letra)))
    return texto
}

//? Vai voltar para o Home do celular
const homeCellPhone = document.getElementById('homeCellPhone')
homeCellPhone.addEventListener('click', () => {
    AbrirPaginas(0)
})

const BarraMusica = document.getElementById('BarraMusica')
BarraMusica.addEventListener('click', () => {
    if(window.visualViewport.width <= 628) {
        FecharPaginas()
        document.getElementById('PagMusicaTocandoAgora').classList.add('Open')
    }
})

const fecharPagMusicaTocandoAgora = document.getElementById('fecharPagMusicaTocandoAgora')
fecharPagMusicaTocandoAgora.addEventListener('click', () => {
    if(window.visualViewport.width <= 628) {
        FecharPaginas()
        document.getElementById('PagMusicaTocandoAgora').classList.remove('Open')
    }
})

//? Ao abrir a pág criar playlist
const btnCriarPlaylist = document.getElementById('btnCriarPlaylist')
btnCriarPlaylist.addEventListener('click', () => {
})