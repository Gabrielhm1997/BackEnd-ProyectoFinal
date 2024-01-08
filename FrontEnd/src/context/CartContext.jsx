import { useState, createContext } from 'react';

export const CartContext = createContext({
    carrito: [],
    precioTotal: 0,
    cantidadProductos: 0
})

export const CartProvider = ({ children }) => {

    const [carrito, setCarrito] = useState([]);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [cantidadProductos, setCantidadProductos] = useState(0);

    const updateCartData = async (cid, token) => {

        try {

            let finalPrice = 0
            let productsQuantity = 0

            let isCart = false

            await getCart(cid, token)
                .then(res => {
                    if (!isCart) {
                        console.log("Error al obtener el carrito")
                    } else {
                        setCarrito(res)

                        carrito.map(product => {
                            finalPrice = finalPrice + (product.id_prod.price * product.id_prod.quantity)
                            productsQuantity = productsQuantity + product.id_prod.quantity
                        })

                        setPrecioTotal(finalPrice)
                        setCantidadProductos(productsQuantity)

                        console.log(carrito)
                        console.log(precioTotal)
                        console.log(cantidadProductos)
                    }
                })
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error)
        }
    }

    const addProduct = async (cid, pid, quantity, token) => {
        fetch(`http://localhost:3000/api/carts/${cid}/product/${pid}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: quantity })
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    console.log(res)
                    updateCartData(cid, token)
                    return true
                } else {
                    console.log(res)
                    return false
                }
            })
            .catch(error => console.log(error))
    }

    const updateQuantity = async (cid, pid, quantity, token) => {
        fetch(`http://localhost:3000/api/carts/${cid}/product/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: quantity })
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    console.log(res)
                    updateCartData(cid, token)
                    return true
                } else {
                    console.log(res)
                    return false
                }
            })
            .catch(error => console.log(error))
    }

    const getCart = async (cid, token) => {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:3000/api/carts/${cid}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status) {
                        console.log(res)
                        //let products = res.products
                        resolve({ status: true, products: res.products })
                    } else {
                        console.log(res)
                        reject({ status: false })
                    }
                })
                .catch(error => console.log(error))
        })
    }

    const loadProduct = async (cid, pid, quantity, token) => {

        try {
            await getCart(cid, token)
                .then(res => {

                    if (!res.status) {
                        console.log("Error al obtener el carrito")
                    } else {
                        console.log(res.products)
                        setCarrito(res.products)
                        console.log(carrito)

                        const productCartFound = carrito.find(product => product.id_prod._id.toString() === pid)
                        console.log(productCartFound)

                        if (productCartFound) {
                            return updateQuantity(cid, pid, quantity, token)
                        } else {
                            return addProduct(cid, pid, quantity, token)
                        }
                    }
                }
                )
                .catch(error => console.log(error))

        } catch (error) {
            console.log(error)
            return false
        }
    }

    const deleteProduct = async (cid, pid, token) => {
        fetch(`http://localhost:3000/api/carts/${cid}/product/${pid}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    console.log(res)
                    updateCartData(cid, token)
                    return true
                } else {
                    console.log(res)
                    return false
                }
            })
            .catch(error => console.log(error))
    }

    const emptyCart = (cid, token) => {
        fetch(`http://localhost:3000/api/carts/${cid}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    console.log(res)
                    updateCartData(cid, token)
                    return true
                } else {
                    console.log(res)
                    return false
                }
            })
            .catch(error => console.log(error))
    }

    return (
        <CartContext.Provider value={{ carrito, precioTotal, cantidadProductos, loadProduct, deleteProduct, emptyCart }}>
            {children}
        </CartContext.Provider>
    )
}