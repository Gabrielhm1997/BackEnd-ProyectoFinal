
const productsButton = document.getElementById("productsButton")
const logout = document.getElementById("logout")

productsButton.innerHTML = `<a href="http://localhost:8080/static/products"><button> Productos </button></a>`

logout.addEventListener("click", async () => {

    fetch(`http://localhost:8080/api/sessions/logout`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            window.location.reload()
        })
        .catch(error => console.log(error))
})
