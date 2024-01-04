const greeting = document.getElementById("greeting")
const specialButton = document.getElementById("specialButton")

fetch(`http://localhost:8080/api/session/current`)
    .then(res => res.json())
    .then(res => {
        console.log(res)

        if (res.status) {
            if (res.user.rol == "admin") {
                greeting.innerHTML = `Bienvenido Admin`
                specialButton.innerHTML = ` <a href="http://localhost:8080/static/admin"><button> Admin </button></a> `

            } else {
                greeting.innerHTML = `Bienvenido ${res.user.first_name}`
                specialButton.innerHTML = ` <a href="http://localhost:8080/static/profile"><button> Perfil </button></a>  `
            }
        } else {
            console.log(res.error)
        }
    })
    .catch(error => console.log(error))