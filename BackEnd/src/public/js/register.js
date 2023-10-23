const formRegister = document.getElementById("formRegister")

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault()

    let datForm = new FormData(e.target)
    let newUser = Object.fromEntries(datForm)

    fetch(`http://localhost:8080/api/users`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            //"Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(newUser)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.status) {
                console.log(data.mensaje)
                //window.location.reload()
            } else {
                console.log(data.mensaje)
            }
        })
        .catch(error => console.log(error))
})