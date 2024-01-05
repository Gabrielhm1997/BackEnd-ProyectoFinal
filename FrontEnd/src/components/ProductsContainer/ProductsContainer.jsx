import ProductList from "../ProductList/ProductList"
import { useEffect, useState } from "react"

export const ProductsContainer = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
        .then(res => res.json())
        .then(res => {
            setProducts(res.docs)
        })
        .catch(error => console.log(error))
    },[])

    return (
        <>
            {/* <h2 className="text-center m-2">{categoria ? categoria.toUpperCase() : "PRODUCTOS"}</h2> */}
            <h2>Productos</h2>
            
            <div className="container-fluid">
                <ProductList products={products} />
            </div>

        </>
    )
}


