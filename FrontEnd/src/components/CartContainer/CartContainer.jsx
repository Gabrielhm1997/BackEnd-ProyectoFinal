import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CartItem } from "../CartItem/CartItem"
import { UserContext } from "../../context/UserContext"
import { getCart, emptyCart } from "../../utils/cart_Tools"
import './Cart.css'

export const CartContainer = () => {
    const { obtenerToken, cargarUsuario } = useContext(UserContext)

    const [cid, setCid] = useState("")
    const [token, setToken] = useState("")

    const [products, setProducts] = useState([])
    const [cantidadProductos, setCantidadProductos] = useState(0)
    const [precioTotal, setPrecioTotal] = useState(0)
    const [isRecargar, setIsRecargar] = useState(false)

    const handlerEmptyCart = async (cid, token) => {
        emptyCart(cid, token)
        setIsRecargar(!isRecargar)
    }

    const cargarCart = async (cid, token, rol) => {

        let carrito = []

        await getCart(cid, token)
            .then(res => {

                carrito = res
                setProducts(res)

                let finalPrice = 0
                let productsQuantity = 0

                carrito.map(product => {
                    finalPrice = finalPrice + (product.id_prod.price * product.quantity)
                    productsQuantity = productsQuantity + product.quantity
                })

                if (rol == "premium") {
                    finalPrice = (finalPrice - (finalPrice * 0.1))
                }

                setCantidadProductos(productsQuantity)
                setPrecioTotal(finalPrice)
            }
            )
            .catch(error => console.log(error))
    }

    useEffect(() => {
        console.log("Cargando Carrito")
        let token = obtenerToken()
        setToken(token)
        let user
        cargarUsuario()
            .then(res => {
                if (res.status) {
                    user = res.user
                    setCid(user.cart)
                    cargarCart(user.cart, token, user.rol)
                } else {
                    console.log("Error al cargar usuario")
                }
            })
            .catch(error => console.log(error))
    }, [isRecargar])

    if (cantidadProductos === 0) {
        return (
            <>
                <h2 className="text-center m-2">No hay productos en el carrito</h2>
                <div className="container-fluid">
                    <div className="row d-flex align-items-center justify-content-center">
                        <Link to="/" className=" col-2 p-0">
                            <button className="btn btn-outline-light btn-carritovacio">Ver Productos</button>
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <h2 className="text-center m-2">CARRITO</h2>

            <div className="cart-container container-fluid p-5">
                <div className="row">
                    <h3 className="col-7 text-center m-0 p-0">Producto</h3>
                    <h3 className="col-2 text-center m-0 p-0">Precio</h3>
                    <h3 className="col-2 text-center m-0 p-0">Cantidad</h3>
                    <p className="col-1"></p>
                </div>
                {products.map(producto => <CartItem key={producto.id_prod._id} item={producto.id_prod} cantidad={producto.quantity}/>)}
                <div className="row d-flex align-items-center justify-content-end">
                    <h3 className="col-2 text-end">Productos: {cantidadProductos}</h3>
                    <h3 className="col-2 text-end">Total: ${precioTotal}</h3>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    <button onClick={() => handlerEmptyCart(cid, token)} className="btn btn-outline-light m-1">Vaciar Carrito</button>
                    <button className="btn btn-outline-light m-1"><Link to="/checkout">Finalizar Compra</Link></button>
                </div>

            </div>
        </>

    )
}
