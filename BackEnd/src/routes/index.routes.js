import { Router } from "express"
import routerSessions from "./sessions.routes.js"
import routerUsers from "./users.routes.js"
import routerProducts from "./products.routes.js"
import routerCarts from "./cart.routes.js"
import routerTest from "./test.routes.js"

const router = Router()

router.use('/session', routerSessions)
router.use('/users', routerUsers)
router.use('/products', routerProducts)
router.use('/carts', routerCarts)
router.use('/test', routerTest)
export default router