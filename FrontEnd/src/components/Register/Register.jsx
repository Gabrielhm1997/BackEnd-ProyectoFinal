import { useRef } from "react"
import { useNavigate } from 'react-router-dom'

import Githublogin from "../GitHubLogin/Githublogin"

export const Register = () => {

  const formRef = useRef(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dataForm = new FormData(formRef.current)
    const userData = Object.fromEntries(dataForm)

    fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(response => {
        if (response.status) {
          navigate('/login')
        } else {
          console.log(response)
        }

      })
      .catch(error => console.log(error))

  }
  return (
    <div className='container-fluid'>
      <h2 className="text-center">Registro</h2>

      <Githublogin />

      <div className="row d-flex justify-content-center align-items-center">

        <form onSubmit={handleSubmit} ref={formRef} className="login_container row col-4 d-flex justify-content-center">
          <div className="mb-3 input_container col-12 row">
            <label htmlFor="first_name" className="text-start">Nombre:</label>
            <input type="text" name='first_name' className="" required/>
          </div>
          <div className="mb-3 input_container col-12 row">
            <label htmlFor="last_name" className="text-start">Apellido:</label>
            <input type="text" name='last_name' className="" required/>
          </div>
          <div className="mb-3 input_container col-12 row">
            <label htmlFor="age" className="text-start">Edad:</label>
            <input type="number" name='age' className="" required/>
          </div>
          <div className="mb-3 input_container col-12 row">
            <label htmlFor="email" className="text-start">Email:</label>
            <input type="mail" name='email' className="" required/>
          </div>
          <div className="mb-3 input_container col-12 row">
            <label htmlFor="password" className="text-start">Contraseña:</label>
            <input type="password" name='password' className="" required/>
          </div>
          
          <button type='submit' className='btn btn-dark col-6'>Registrarse</button>
        </form>

      </div>

    </div>
  )
}