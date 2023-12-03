// Adiciona um parâmetro à URL sem recarregar a página
function adicionarParametroSemAtualizarPagina(nome, valor) {
  // Obtém o estado atual do histórico
  var state = { };
  var novaURL;

  // Adiciona o novo parâmetro à URL
  if (history.pushState) {
    novaURL = window.location.href + (window.location.search ? '&' : '?') + encodeURIComponent(nome) + '=' + encodeURIComponent(valor);
    history.pushState(state, null, novaURL);
  } else {
    // Se o navegador não suportar pushState, você pode usar window.location.hash
    novaURL = window.location.href + '#' + encodeURIComponent(nome) + '=' + encodeURIComponent(valor);
    window.location.hash = novaURL;
  }

  // Atualiza a página ou realiza a lógica necessária com a nova URL
  // Exemplo: atualizarConteudo();
}

// Exemplo de uso
setTimeout(() => {
    adicionarParametroSemAtualizarPagina('exemplo', 'valor');
}, 7000)