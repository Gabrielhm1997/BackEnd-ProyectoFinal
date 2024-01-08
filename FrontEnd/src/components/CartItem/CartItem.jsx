import { useContext, useEffect, useState } from "react"
//import { CarritoContext } from "../../context/CarritoContext"
import { UserContext } from "../../context/UserContext"
import { deleteProduct } from "../../utils/cart_Tools"
import './CartItem.css'

export const CartItem = ({ item, cantidad }) => {
  //const { eliminarProducto } = useContext(CarritoContext);
  const { cart, obtenerToken } = useContext(UserContext)
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(obtenerToken())
  }, [])

  return (
    <div className="row d-flex align-items-center justify-content-center">

      <div className="col-3 d-flex align-items-center justify-content-center p-2">
        <img src={item.img} className="img-carrito"></img>
      </div>
      <div className="col-4">
        <h4 className="text-center m-0"> {item.nombre}</h4>
      </div>
      <div className="col-2">
        <p className="text-center m-0">${item.precio}</p>
      </div>
      <div className="col-2">
        <p className="text-center m-0">{cantidad}</p>
      </div>
      <div className="col-1 d-flex align-items-center justify-content-center">
        <button onClick={() => deleteProduct(cart, item._id, token)} className="btn btn-outline-light"> Eliminar </button>
      </div>

    </div>
  )
}