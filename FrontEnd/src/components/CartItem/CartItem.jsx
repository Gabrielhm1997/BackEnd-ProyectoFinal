import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext"
import './CartItem.css'

export const CartItem = ({ item, cantidad }) => {
  const { cart, obtenerToken } = useContext(UserContext)
  const [token, setToken] = useState("")

  useEffect(() => {
    setToken(obtenerToken())
  }, [])

  return (
    <div className="row d-flex align-items-center justify-content-center">

      <div className="col-3 d-flex align-items-center justify-content-center p-2">
        <img  className="img-carrito"></img>
      </div>
      <div className="col-4">
        <h4 className="text-center m-0"> {item.title}</h4>
      </div>
      <div className="col-2">
        <p className="text-center m-0">${item.price}</p>
      </div>
      <div className="col-2">
        <p className="text-center m-0">{cantidad}</p>
      </div>
      <div className="col-1 d-flex align-items-center justify-content-center"></div>

    </div>
  )
}