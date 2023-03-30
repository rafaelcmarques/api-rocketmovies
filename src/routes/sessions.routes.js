const { Router } = require("express")

const SessionsCrontroller = require("../controllers/SessionsCrontroller")
const sessionsCrontroller = new SessionsCrontroller()

const sessionsRoutes = Router()
sessionsRoutes.post("/", sessionsCrontroller.create)

module.exports = sessionsRoutes
