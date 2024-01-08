import ProductList from "../ProductList/ProductList"
import { useEffect, useState } from "react"

import { useContext } from "react"
import { UserContext } from "../../context/UserContext"

export const ProductsContainer = () => {

    const { cargarUsuario, first_name } = useContext(UserContext)

    const [products, setProducts] = useState([])

    useEffect(() => {
        cargarUsuario()

        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(res => {
                setProducts(res.docs)
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <>
            <h2 className="text-center">Productos</h2>

            <div className="container-fluid">
                <ProductList products={products} />
            </div>

        </>
    )
}


