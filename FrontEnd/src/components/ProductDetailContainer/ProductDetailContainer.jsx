import { useState, useEffect } from "react"
import ProductDetail from "../ProductDetail/ProductDetail"
import { useParams } from "react-router-dom"

const ProductDetailContainer = () => {

    const [product, setProduct] = useState(null);

    const { idItem } = useParams();
 
    useEffect( () => {

        // const nuevoDoc = doc(db, "inventario", idItem);

        // getDoc(nuevoDoc)
        //   .then(respuesta => {setProducto({id: respuesta.id, ...respuesta.data()})})
        //   .catch(error => console.log(error))

        fetch(`http://localhost:3000/api/products/${idItem}`)
        .then(res => res.json())
        .then(res => {
            if(res.status){
              setProduct(res.product)
            } else {
              console.log("Error al buscar producto")
            }
            
        })
        .catch(error => console.log(error))

    }, [idItem]);

   return (
    <div className="container-fluid row d-flex justify-content-center m-0 p-0">
        <h2 className="text-center col-12">Detalles del Producto</h2>
        <ProductDetail {...product}/>
    </div>
  )
}
 
export default ProductDetailContainer