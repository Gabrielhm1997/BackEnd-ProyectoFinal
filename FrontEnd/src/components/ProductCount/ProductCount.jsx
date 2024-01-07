import React from 'react'
import { useState } from 'react'

export const ProductCount = ({ inicial, stock, funcionAgregar }) => {

    const [contador, setContador] = useState(inicial)

    const incrementar = () => {
        if (contador < stock) {
            setContador(contador + 1);
        }
    }

    const decrementar = () => {
        if (contador > inicial) {
            setContador(contador - 1);
        }
    }

    return (

        <>
            <div className='d-flex justify-content-center align-items-center'>
                <button onClick={decrementar} className="btn btn-outline-light"> - </button>
                <p className='text-center p-0 m-3'>{contador}</p>
                <button onClick={incrementar} className="btn btn-outline-light"> + </button>
            </div>
            <button onClick={() => funcionAgregar(contador)} type="button" className="btn btn-outline-light col-6">Agregar al Carrito</button>
        </>
    )
}
