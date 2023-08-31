const linkPagina = document.getElementsByClassName('linkPagina')
const Paginas = document.getElementsByClassName('Paginas')

function FecharPaginas() {
    document.querySelector('body').style.overflow = 'auto'
    document.getElementById('inputPesquisa').value = ''

    for(let c = 0; c < Paginas.length; c++) {
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
    })
}

function removerEspacosEAcentos(texto) {
    texto = texto.replace(/\s/g, '')
    const acentos = 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÕÖØòóôõöøÙÚÛÜùúûüÝýÿÑñÇç'
    const naoAcentuados = 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOOooooooUUUUuuuuyyNnCc'
    const regExpAcentos = new RegExp(`[${acentos}]`, 'g')
    texto = texto.replace(regExpAcentos, (letra) => naoAcentuados.charAt(acentos.indexOf(letra)))
    return texto
  }