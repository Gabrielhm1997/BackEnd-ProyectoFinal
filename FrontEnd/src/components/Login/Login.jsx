import { useRef } from "react"
import Githublogin from "../GitHubLogin/Githublogin"

import './Login.css'

export default function login() {

    const formRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const dataForm = new FormData(formRef.current)
        const userData = Object.fromEntries(dataForm)

        fetch('http://localhost:8080/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(userData)
        }) .then(response => console.log(response))
            .catch(error => console.log(error))

    }


    return (
        <div className='container-fluid'>
            <h2 className="text-center">Login</h2>
            <Githublogin />
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
        </div>
    )
}