import { BrowserRouter, Routes, Route } from "react-router-dom"
import { UserProvider } from "./context/UserContext"

import { NavBar } from "./components/NavBar/NavBar"
import { Login } from "./components/Login/Login"
import { Register } from "./components/Register/Register"
import { ProductsContainer } from "./components/ProductsContainer/ProductsContainer"
import { CartContainer } from "./components/CartContainer/CartContainer"
import { Checkout } from "./components/Checkout/Checkout"
import ProductDetailContainer from "./components/ProductDetailContainer/ProductDetailContainer"

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<ProductsContainer />}></Route>
            <Route path="/item/:idItem" element={<ProductDetailContainer />} />
            <Route path="/cart" element={<CartContainer />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<h1>404 Not Found</h1>}></Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  )
}