import Product from "../Product/Product"

const ProductList = ({products}) => {
  return (
    <div className="row d-flex justify-content-start align-items-center">
        {products.map(product => <Product key={product._id} {...product}/>)}
    </div>
  )
}

export default ProductList