import { Router } from "express"
import routerSessions from "./sessions.routes.js"
import routerUsers from "./users.routes.js"
import routerProducts from "./products.routes.js"
import routerCarts from "./cart.routes.js"

const router = Router()

router.use('/sessions', routerSessions)
router.use('/users', routerUsers)
router.use('/products', routerProducts)
router.use('/carts', routerCarts)

export default router