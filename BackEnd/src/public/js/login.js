const githubButton = document.getElementById("github")
const formLogin = document.getElementById("formLogin")
const errorMessage = document.getElementById("message")

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()
 
    let datForm = new FormData(e.target)
    let user = Object.fromEntries(datForm)
 
    fetch(`http://localhost:3000/api/session/login`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            //"Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(res => {

            if (res.status) {
                window.location.reload()
            } else {
                errorMessage.innerHTML = `${res.error}`
            }
        })
        .catch(error => console.log(error))
})