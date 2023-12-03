//? Vai pegar a ID na url da pag
function pegarValorDaUrl() {
    const urlCompleta = window.location.href;
    const indexInterrogacao = urlCompleta.indexOf('?');

    if (indexInterrogacao !== -1) {
        // O caractere '?' foi encontrado na URL
        const valorDaQuery = urlCompleta.slice(indexInterrogacao + 1);
        tocarMusicaDaUrl(valorDaQuery)
    } else {
        // Não foi encontrado o caractere '?' na URL
        return null;
    }
}

function tocarMusicaDaUrl(ID) {
    for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
        if(TodasMusicas.Musicas[c].ID == ID) {
            FecharPaginas()
            const imgPerfilArtista = document.getElementById('imgPerfilArtista')
            if(TodasMusicas.Musicas[c].LinkImg.includes ('treefy')) {
              imgPerfilArtista.classList.add('imgPerfilArtistaTreeFy')
            } else {
                imgPerfilArtista.classList.remove('imgPerfilArtistaTreeFy')
            }
            imgPerfilArtista.src = TodasMusicas.Musicas[c].LinkImg
            document.getElementById('NomeArtista').innerText = TodasMusicas.Musicas[c].Autor
            document.getElementById('containerMusicasArtista').innerHTML = ''
            document.querySelector('body').style.overflow = 'hidden'
            RetornarMusicasArtista(TodasMusicas.Musicas[c].Autor, document.getElementById('containerMusicasArtista'))
            SalvarHistoricoDePaginas(document.getElementById('PagArtistas'))

             for(let b = 0; b < arrayMusicasArtista.length; b++) {
                if(arrayMusicasArtista[b].ID == ID) {
                    ListaProxMusica = {
                        Musicas: arrayMusicasArtista,
                        Numero: b,
                    }
                    DarPlayMusica(arrayMusicasArtista[b], b)
                }
            }
        }
    }
}

//? Vai mandar o link da música para a área de tranferencia
const liCompartilharMusica = document.querySelector('#liCompartilharMusica')
liCompartilharMusica.addEventListener('click', () => {
    const urlSemQuery = window.location.origin + window.location.pathname
    const link = `${urlSemQuery}?${musicaSelecionadaBtnDireito.ID}`
    navigator.clipboard.writeText(link).then(function() {
        console.log('Link copiado para a área de transferência!')
        Notificar('Link copiado para a área de transferência!', 'Link Copiado')
    }, function(err) {
        console.error('Erro ao copiar o link: ', err)
    })
})

function Notificar(text, notification) {
    const containerNotification = document.querySelector('#containerNotification')
    const msgNotification = document.querySelector('#msgNotification')
    const imgNotification = document.querySelector('#imgNotification')

    msgNotification.innerText = text

    if(notification == 'Link Copiado') {
        imgNotification.src = 'Assets/Imgs/Icons/checkmark.png'
    } else if('Error Link Copiado') {
        imgNotification.src = 'Assets/Imgs/Icons/cross.png'
    }

    containerNotification.classList.add('containerNotificationActive')

    setTimeout(() => {
        containerNotification.classList.remove('containerNotificationActive')
    }, 5000)
}