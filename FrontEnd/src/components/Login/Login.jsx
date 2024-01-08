import { useRef, useContext } from "react"
import { useNavigate, Link } from 'react-router-dom'

import './Login.css'

export const Login = () => {

    const formRef = useRef(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataForm = new FormData(formRef.current)
        const userData = Object.fromEntries(dataForm)

        fetch('http://localhost:3000/api/session/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(response => {
                if (response.status) {
                    document.cookie = `jwtCookie=${response.token}; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/`
                    navigate('/')
                } else {
                    console.log("Contraseña o email incorrectos")
                }

            })
            .catch(error => console.log(error))

    }
    return (
        <div className='container-fluid'>
            <h2 className="text-center">Login</h2>
            <div className='d-flex justify-content-center align-items-center'>
                <button type="button" className="btn btn-outline-light"><Link to={`/register`} className="col-12 d-flex justify-content-center align-items-center">Registrarse</Link></button>
            </div>
            <div className="row d-flex justify-content-center align-items-center">
                <form onSubmit={handleSubmit} ref={formRef} className="login_container row col-4 d-flex justify-content-center">

                    <div className="mb-3 input_container col-12 row">
                        <label htmlFor="email" className="text-start">Email:</label>
                        <input type="mail" name='email' className="" />
                    </div>
                    <div className="mb-3 input_container col-12 row">
                        <label htmlFor="password" className="text-start">Contraseña:</label>
                        <input type="password" name='password' className="" />
                    </div>
                    <button type='submit' className='btn btn-dark col-6'>Iniciar Sesion</button>
                </form>

            </div>

        </div >
    )
}