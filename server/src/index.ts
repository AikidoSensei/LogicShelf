import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import bodyparser from 'body-parser'
import dotenv from 'dotenv'
import routesDashboard from './routes/routesDashboard'
import routesProduct from './routes/productRoutes'
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
const port = process.env.PORT || 3001
app.use('/dashboard', routesDashboard)
app.use('/products', routesProduct )

app.listen(port, ()=>{
 console.log(`App is running at ${port}`)
})