import { ProductCount } from '../ProductCount/ProductCount'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { loadProduct } from '../../utils/cart_Tools'

import './ProductDetails.css'

const ProductDetail = ({ _id, title, price, img, stock, description }) => {

  const { cart, obtenerToken, cargarUsuario } = useContext(UserContext)
  const [cantidadAgregada, setcantidadAgregada] = useState(0);

  //const { agregarProducto } = useContext(CarritoContext);

  useEffect(() => {
    cargarUsuario()
  },[])

  const manejadorCantidad = (cantidad) => {
    setcantidadAgregada(cantidad)
    let token = obtenerToken()
    loadProduct(cart, _id, cantidad, token)
    //const item = { _id, title, price, img, description };
    //agregarProducto(item, cantidad);
  }
  

  return (
    <div className='itemDetail p-5 col-10 container-fluid row d-flex justify-content-center align-items-center'>

      <div className='contenedor-imagen col-6 d-flex justify-content-center align-items-center'>
        <img src={img} alt={title} className="img-detalles" />
        <img className={stock === 0 ? "agotado-detalles" : "no-agotado"} src="/img/agotado.png"></img>
      </div>

      <div className='col-6'>
        <h2 className='text-center'>{title}</h2>
        <h3 className='text-center'>{description}</h3>
        <h3 className='text-center'>${price}</h3>
        <h3 className='text-center'>ID: {_id}</h3>
        <h3 className='text-center'>Unidades Disponibles: {stock}</h3>
        <div className="container-fluid ms-0 mt-2 row d-flex justify-content-center align-items-center">

          {stock <= 0 ?
            <strong className='text-center m-0' style={{ color: "red" }}>Agotado</strong>
            :
            cantidadAgregada > 0 ? <Link to="/cart" className="btn btn-outline-light col-6"> Ir al Carrito </Link> : <ProductCount pid={_id} inicial={1} stock={stock} funcionAgregar={manejadorCantidad} />
          }

        </div>
      </div>
    </div>
  )
}

export default ProductDetail