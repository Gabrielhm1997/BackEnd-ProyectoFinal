import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CartItem } from "../CartItem/CartItem"
import { UserContext } from "../../context/UserContext"
import { getCart, emptyCart } from "../../utils/cart_Tools"
import './Cart.css'

export const CartContainer = () => {
    const { cargarUsuario, cart, obtenerToken } = useContext(UserContext)

    const [token, setToken] = useState("")
    const [cid, setCid] = useState("")
    const [products, setProducts] = useState([])
    const [cantidadProductos, setCantidadProductos] = useState(0)
    const [precioTotal, setPrecioTotal] = useState(0)

    const cargarCart = () => {
        
        setToken(obtenerToken())
        console.log(token)
        console.log(cart)

        getCart(cart, token)
            .then(res => {
                setProducts(res)

                let finalPrice = 0
                let productsQuantity = 0

                console.log(products)
                products.map(product => {
                    finalPrice = finalPrice + (product.id_prod.price * product.id_prod.quantity)
                    productsQuantity = productsQuantity + product.id_prod.quantity
                })

                setCantidadProductos(productsQuantity)
                setPrecioTotal(finalPrice)

                console.log(cantidadProductos)
                console.log(precioTotal)
            }
            )
            .catch(error => console.log(error))
    }

    useEffect(() => {
        console.log("cargando")
        cargarUsuario()
        cargarCart()
        console.log("cargado")
    }, [])

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
                {products.map(producto => <CartItem key={producto.id_prod._id} {...producto.id_prod} />)}
                <div className="row d-flex align-items-center justify-content-end">
                    <h3 className="col-2 text-end">Productos: {cantidadProductos}</h3>
                    <h3 className="col-2 text-end">Total: ${precioTotal}</h3>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    <button onClick={() => emptyCart(cart, token)} className="btn btn-outline-light m-1">Vaciar Carrito</button>
                    <Link to="/checkout"><button className="btn btn-outline-light m-1">Finalizar Compra</button></Link>
                </div>

            </div>
        </>

    )
}
