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


// function InfosRecomendarMusica() {
//     let GenerosFavoritosUser = []
//     for(let c = 0; c < TodasMusicas.length; c++) {
//         GenerosFavoritosUser.push(TodasMusicas[c].Genero)
//     }
    
//     let GenerosDasMusicasFavoritasUser = ordernarArray(GenerosFavoritosUser)
//     console.log(GenerosDasMusicasFavoritasUser)

// } setTimeout(() => {
//     InfosRecomendarMusica()
// }, 2000)