import express from "express"
import cors from "cors"
import path from "path"
import cursoRoutes from "./routes/cursos.routes"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

app.use("/api/cursos", cursoRoutes)

export default app
