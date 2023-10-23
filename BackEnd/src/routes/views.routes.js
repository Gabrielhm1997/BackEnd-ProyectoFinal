import { Router } from "express"

const routerViews = Router()

routerViews.get('/', async (req, res) => {//Login
    //console.log(req.session.user)
    if (req.user) {
        res.status(200).redirect('/static/products')
    } else {
        res.status(200).render('login', {
            script: "login",
            title: "Login",
            css: "login",
        })
    }
})

routerViews.get('/register', async (req, res) => {//Registro
    //console.log(req.session.user)
    if (req.user) {
        res.status(200).redirect('/static/products')
    } else {
        res.status(200).render('register', {
            script: "register",
            title: "Register",
            css: "login"
        })
    }
})

routerViews.get('/products', async (req, res) => {//Productos
    //console.log(req.session.user)
    if (req.user) {
        res.status(200).render('products', {
            script: "products",
            title: "Products",
            css: "products"
        })
    } else {
        res.status(200).redirect('/static')
    }
})

routerViews.get('/profile', async (req, res) => {//Perfil
    //console.log(req.session.user)
    if (req.user) {
        res.status(200).render('profile', {
            script: "profile",
            title: "Profile",
            css: "profile"
        })
    } else {
        res.status(200).redirect('/static')
    }
})

routerViews.get('/admin', async (req, res) => {//Admin
    //console.log(req.session.user)
    if (req.user && req.user.rol == "admin") {
        res.status(200).render('admin', {
            script: "admin",
            title: "Admin",
            css: "admin"
        })
    } else if (req.user) {
        res.status(200).redirect('/static/products')
    } else {
        res.status(200).redirect('/static')
    }
})

export default routerViews