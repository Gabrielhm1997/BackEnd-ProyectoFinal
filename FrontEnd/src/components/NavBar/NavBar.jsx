import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'

import CartWidget from '../CartWidget/CartWidget'
import { Link, NavLink } from 'react-router-dom'
import './NavBar.css'

export const NavBar = () => {

    const { cargarUsuario, first_name } = useContext(UserContext)
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        cargarUsuario()
            .then(res => {
                if (res.status) {
                    setIsLogged(true)
                } else {
                    console.log("Error al cargar usuario")
                    setIsLogged(false)
                }
            })
            .catch(error => console.log(error))
    }, [])

    return (
        <header id="inicio">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link to={"/"}>
                        <div className="d-flex justify-content-center align-items-center">
                            <img src="/img/logo.jpg" alt="logo" className="logo img-fluid rounded-circle me-2" />
                            <h1 className="titulo fw-bold">Frosty Bite</h1>
                        </div>
                    </Link>

                    <CartWidget />
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h4 className="offcanvas-title titulo" id="offcanvasNavbarLabel">Frosty Bite</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
                        </div>
                        {
                            isLogged ?
                                <div className="offcanvas-body">
                                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                        <li className="nav-item d-flex align-items-center justify-content-end m-2">
                                            {`Hola ${first_name}`}
                                        </li>
                                    </ul>
                                </div>
                                :
                                <div className="offcanvas-body">
                                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                        <li className="nav-item d-flex align-items-center justify-content-end m-2">
                                            <NavLink to={"/login"}>Iniciar Sesion</NavLink>
                                        </li>
                                    </ul>
                                </div>
                        }
                        {/* <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item d-flex align-items-center justify-content-end m-2">
                                    <NavLink to={"/categoria/palitos"}>Palitos</NavLink>
                                </li>
                                <li className="nav-item d-flex align-items-center justify-content-end m-2">
                                    <NavLink to={"/categoria/baldes"}>Baldes</NavLink>
                                </li>
                                <li className="nav-item d-flex align-items-center justify-content-end m-2">
                                    <NavLink to={"/categoria/postres"}>Postres</NavLink>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </nav>
        </header>
    )
}