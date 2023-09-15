const linkPagina = document.getElementsByClassName('linkPagina')
const Paginas = document.getElementsByClassName('Paginas')
const Open = document.getElementsByClassName('Open')

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

for(let c = 0; c < linkPagina.length; c++) {
    document.getElementsByClassName('linkPagina')[c].addEventListener('click', () => {
        AbrirPaginas(c)
    })
}

function AbrirPaginas(c) {
    FecharPaginas()
        
    setTimeout(() => {
        document.getElementsByClassName('linkPagina')[c].style.color = '#0FF'
        
        try {
            let img = document.getElementsByClassName('linkPagina')[c].querySelector('img')
            img.src = img.src.replace('.png', 'Selected.png')
        } catch{}
    }, 100)
    try {
        document.getElementById(`Pag${removerEspacosEAcentos(linkPagina[c].innerText)}`).style.display = 'block'
        document.querySelector('body').style.overflow = 'hidden'
    } catch{}
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