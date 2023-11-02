import { useRef } from "react"
import './Login.css'

export default function login() {

    const formRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
    }


    return (
        <div className='container-fluid'>
            <h2 className="text-center">Login</h2>
            <div className="row d-flex justify-content-center align-items-center">
                <form onSubmit={handleSubmit} ref={formRef} className="login_container row col-4 d-flex justify-content-center">
                    <div className="mb-3 input_container col-12 row">
                        <label htmlFor="email" className="text-start">Email:</label>
                        <input type="mail" name='email' className=""/>
                    </div>
                    <div className="mb-3 input_container col-12 row">
                        <label htmlFor="password" className="text-start">Contraseña:</label>
                        <input type="password" name='password' className=""/>
                    </div>
                    <button type='submit' className='btn btn-dark col-6'>Iniciar Sesion</button>
                </form>
            </div>
        </div>
    )
}