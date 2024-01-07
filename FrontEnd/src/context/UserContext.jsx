import { useState, createContext } from "react"

export const UserContext = createContext({
    id: "",
    first_name: "",
    last_name: "",
    age: 0,
    email: "",
    rol: "",
    cart: "",
    last_connection: 0
})

export const UserProvider = ({ children }) => {

    const [id, setId] = useState("")
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [age, setAge] = useState(0)
    const [email, setEmail] = useState("")
    const [rol, setRol] = useState("")
    const [cart, setCart] = useState("")
    const [last_connection, setLast_connection] = useState(0)

    const cargarUsuario = async () => {

        let token = obtenerToken()

        fetch(`http://localhost:3000/api/session/current`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    setId(res.user._id)
                    setFirst_name(res.user.first_name)
                    setLast_name(res.user.last_name)
                    setAge(res.user.age)
                    setEmail(res.user.email)
                    setRol(res.user.rol)
                    setCart(res.user.cart)
                    setLast_connection(res.user.last_connection)
                } else {
                    console.log(res)
                }
            })
            .catch(error => console.log(error))
    }

    const obtenerToken = () => {
        const cookieArray = document.cookie.split('; ')
        let token = null
        for (const cookie of cookieArray) {
            const [name, value] = cookie.split("=")
            if (name == "jwtCookie") {
                token = value
                break
            }
        }

        return token
    }

    return (
        <UserContext.Provider value={{ id, first_name, last_name, age, email, rol, cart, last_connection, obtenerToken, cargarUsuario }}>
            {children}
        </UserContext.Provider>
    )
}