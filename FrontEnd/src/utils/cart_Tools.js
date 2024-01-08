
const addProduct = async (cid, pid, quantity, token) => {
    fetch(`http://localhost:3000/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({quantity: quantity})
    })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                console.log(res)
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
        body: JSON.stringify({quantity: quantity})
    })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                console.log(res)
                return true
            } else {
                console.log(res)
                return false
            }
        })
        .catch(error => console.log(error))
}

export const getCart = async (cid, token) => {
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
                    let products = res.products
                    resolve(products)
                } else {
                    console.log(res)
                    reject(false)
                }
            })
            .catch(error => console.log(error))
    })
}

export const loadProduct = async (cid, pid, quantity, token) => {

    try {
        let cart = []

        await getCart(cid, token)
            .then(res => cart = res)
            .catch(error => console.log(error))

        if (!cart) {
            console.log("Error al obtener el carrito")
            return false
        }

        const productCartFound = cart.find(product => product.id_prod._id.toString() === pid)

        if (productCartFound) {
            return updateQuantity(cid, pid, quantity, token)
        } else {
            return addProduct(cid, pid, quantity, token)
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

// export const deleteProduct = async (cid, pid, token) => {
//     fetch(`http://localhost:3000/api/carts/${cid}/product/${pid}`, {
//         method: 'DELETE',
//         headers: {
//             'Content-type': 'application/json; charset=UTF-8',
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(res => res.json())
//         .then(res => {
//             if (res.status) {
//                 console.log(res)
//                 return true
//             } else {
//                 console.log(res)
//                 return false
//             }
//         })
//         .catch(error => console.log(error))
// }

export const emptyCart = (cid, token) => {
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
                return true
            } else {
                console.log(res)
                return false
            }
        })
        .catch(error => console.log(error))
}

export const purchase = (cid, token) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:3000/api/carts/${cid}/purchase`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                console.log(res)
                resolve (res)
            } else {
                console.log(res)
                reject (res)
            }
        })
        .catch(error => console.log(error))
    })
}