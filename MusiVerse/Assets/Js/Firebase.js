const firebaseConfig = {
    apiKey: "AIzaSyDcxRheDy1LJCMrC_TPt5QTdomVBnRIRVU",
    authDomain: "musiverse-e89c0.firebaseapp.com",
    projectId: "musiverse-e89c0",
    storageBucket: "musiverse-e89c0.appspot.com",
    messagingSenderId: "750244530290",
    appId: "1:750244530290:web:4c19979dd17d232eb39aeb"
}

  // Initialize Firebase
firebase.initializeApp(firebaseConfig)
const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

let currentUser = {} //? Vai conter as informações do user
let TodosOsUsers = []
document.addEventListener("DOMContentLoaded", function () {
  //? Obeserva se há um usuário e mudanças na autenticação (login, logout)
  firebase.auth().onAuthStateChanged((usuario) => {
    if(usuario) {
      currentUser.InfoEmail = usuario

      db.collection('Users').get().then((snapshot) => {
        let contador = 0
        console.log('Chamada feita, carregar info user')

        snapshot.docs.forEach(Users => {
            const InfoUsers = Users.data()

            TodosOsUsers.push({
              User: InfoUsers
            })

            TodosOsUsers[contador].User.Id = Users.id
           
            if(InfoUsers.Email == currentUser.InfoEmail.email) {
              currentUser.User = InfoUsers
              currentUser.User.Id = Users.id

              try {
                if(currentUser.InfoEmail.photoURL != null) {
                  const imgPerfilUser = document.getElementById('imgPerfilUser')
                  imgPerfilUser.src = currentUser.InfoEmail.photoURL
                  imgPerfilUser.style.display = 'block'
        
                  document.getElementById('imgPerfilUserHeaderUser').style.backgroundImage = `url(${currentUser.InfoEmail.photoURL})`
                } else {
                  //? Vai colocar a primeira letra do email e um background que foi salvo
                  const containerUserNavBar = document.getElementById('containerUserNavBar')
                  containerUserNavBar.style.background = currentUser.User.Personalizar.BackgroundPerfil
                  const LetraNomePerfilUser = document.getElementById('LetraNomePerfilUser')
                  LetraNomePerfilUser.innerText = currentUser.InfoEmail.email.charAt(0)
                  LetraNomePerfilUser.style.display = 'block'
                }
                
              } catch{
                //? Vai colocar a primeira letra do email e um background que foi salvo
                try {
                  const containerUserNavBar = document.getElementById('containerUserNavBar')
                  containerUserNavBar.style.background = currentUser.User.Personalizar.BackgroundPerfil
                  const LetraNomePerfilUser = document.getElementById('LetraNomePerfilUser')
                  LetraNomePerfilUser.innerText = currentUser.InfoEmail.email.charAt(0)
                  LetraNomePerfilUser.style.display = 'block'
                } catch {}
              }
            }

          contador++
        })
      })
    }
  })
})

// Função para gerar um UID único
function generateUniqueUid() {
  return db.collection('MusicasPostadas').doc().id
}

function login() {
  auth.signInWithPopup(provider)
}

try {
  document.getElementById('containerUserNavBar').addEventListener('click', () => {
    location.href = 'Cadastro.html'
  })
} catch{}