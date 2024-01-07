import { BrowserRouter, Routes, Route } from "react-router-dom"
import { UserProvider } from "./context/UserContext"

import { Login } from "./components/Login/Login"
import { Register } from "./components/Register/Register"
import { ProductsContainer } from "./components/ProductsContainer/ProductsContainer"
import ProductDetailContainer from "./components/ProductDetailContainer/ProductDetailContainer"

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/products" element={<ProductsContainer />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/item/:idItem" element={<ProductDetailContainer />} />
            <Route path="*" element={<h1>404 Not Found</h1>}></Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  )
}