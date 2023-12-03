//? Vai pegar a ID na url da pag
function obterValoresDaURL() {
  // Obtém a URL atual
  var urlAtual = window.location.href;

  // Cria um novo objeto URL com a URL atual
  var url = new URL(urlAtual);

  // Obtém os parâmetros de pesquisa da URL
  var parametros = url.searchParams;

  // Obtém os valores de music, artist, playlist e profile
  var music = parametros.get('music');
  var artist = parametros.get('artist');
  var playlist = parametros.get('playlist');
  var profile = parametros.get('profile');

  if(artist != undefined) {
    InfosUrl.Page.Name = 'artist';
    InfosUrl.Page.ID = artist;
  } else if(playlist != undefined) {
    InfosUrl.Page.Name = 'playlist';
    InfosUrl.Page.ID = playlist;
  } else if(profile != undefined) {
    InfosUrl.Page.Name = 'profile';
    InfosUrl.Page.ID = profile;
  }

  InfosUrl.Music = music
  
  tocarMusicaDaUrl(music, InfosUrl.Page)
}


function tocarMusicaDaUrl(ID, Page) {
    let MusicaDaUrl

    //? Vai dar play na música
    try {
        for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
            if(TodasMusicas.Musicas[c].ID == ID) {
                MusicaDaUrl = TodasMusicas.Musicas[c]

                if(Page.Name == undefined || Page.Name == '') {
                    try {
                        AbrirPerfilArtista(MusicaDaUrl)
                    } catch{}

                    for(let b = 0; b < arrayMusicasArtista.length; b++) {

                        if(arrayMusicasArtista[b].ID == ID) {
                            ListaProxMusica = {
                                Musicas: arrayMusicasArtista,
                                Numero: b,
                            }
                            DarPlayMusica(arrayMusicasArtista[b], b)
                        }
                    }
                } else {
                    ListaProxMusica = {
                        Musicas: TodasMusicas.Musicas[c],
                        Numero: c,
                    }
                    DarPlayMusica(TodasMusicas.Musicas[c], c)
                }
            }
        }
    } catch{}

    if(Page.Name == 'artist') {
        for(let c = 0; c < TodasMusicas.Musicas.length; c++) {
            if(TodasMusicas.Musicas[c].ID == Page.ID) {
                try {
                    AbrirPerfilArtista(TodasMusicas.Musicas[c])
                } catch{}
            }
        }

    } else if(Page.Name == 'playlist') {
        try {
            for(let c = 0; c < TodasMusicas.Playlists.length; c++) {
                if(TodasMusicas.Playlists[c].ID == Page.ID) {
                    AbrirPlaylist(TodasMusicas.Playlists[c])
                }
            }
        } catch{}
        
    } else if(Page.Name == 'profile') {
        try {
            for(let c = 0; c < TodosOsUsers.length; c++) {
                if(TodosOsUsers[c].User.Id == Page.ID) {
                    AbrirPerfilOutroUser(TodosOsUsers[c].User)
                }
            }
        } catch{}
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