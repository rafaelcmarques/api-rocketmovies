const { Router } = require("express")

const userRoutes = require("./users.routes")
const movieNotesRoutes = require("./movieNotes.routes")
const sessionsRoutes = require("./sessions.routes")

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/movie-notes", movieNotesRoutes)
routes.use("/sessions", sessionsRoutes)

module.exports = routes
