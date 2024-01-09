import { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../../context/UserContext"
import { purchase } from "../../utils/cart_Tools"

export const Checkout = () => {

    const { obtenerToken, cargarUsuario } = useContext(UserContext)
    const [ticket, setTicket] = useState({})
    const [isExitosa, setIsExitosa] = useState(false)
    const [errorPurchase, setErrorPurchase] = useState({})

    const finalizarCompra = async (cid, token) => {
        purchase(cid, token)
            .then(res => {
                if (res.status) {
                    console.log(res.ticket)
                    setTicket(res.ticket)
                    setIsExitosa(true)
                }
            })
            .catch(error => {
                setIsExitosa(false)
                setErrorPurchase(error)
                console.log(error)
            })
    }

    useEffect(() => {
        let token = obtenerToken()
        let user
        cargarUsuario()
            .then(res => {
                if (res.status) {
                    user = res.user
                    finalizarCompra(user.cart, token)
                } else {
                    console.log("Error al cargar usuario")
                    setErrorPurchase(res.message)
                }
            })
            .catch(error => {
                setIsExitosa(false)
                setErrorPurchase(error)
                console.log(error)
            })
    }, [])

    if (!isExitosa) {
        return (
            <>
                <h2 className="text-center">Finalizar Compra</h2>
                <p className="text-center">Hubo un error en la Compra</p>
                <p className="text-center">{errorPurchase.message}</p>
            </>
        )
    }

    return (
        <>
            <h2 className="text-center">Finalizar Compra</h2>
            <p className="text-center">Compra Exitosa</p>
            <p className="text-center">Su numero de Ticket es: {ticket.code}</p>
        </>
    )
}
