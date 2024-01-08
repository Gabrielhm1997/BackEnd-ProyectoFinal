import { Link } from 'react-router-dom'
import './CartWidget.css'

const CartWidget = () => {

  return (
    <div className="cartWidget d-flex justify-content-center align-items-center">
      <Link to="/cart" className='d-flex justify-content-center align-items-center'>
        <i className="bi bi-cart3 m-0 p-0 d-flex justify-content-center align-items-center"></i>
      </Link>
    </div>
  )
}

export default CartWidget