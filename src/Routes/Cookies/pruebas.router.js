import { Router } from "express";
import { generateUser } from "../../utils/generateUsersMock.js";
import compression from 'express-compression'

const routerCookie = Router()
routerCookie.use(compression({
    brotli: {
        enabled: true,
        zlib: {}
    }
}))

routerCookie.get('/stringmuylargo', (req, res) => {
    let string = `hola coders soy un string horriblemente largo`
    for (let i = 0; i < 5e4; i++) {
        string += `Hola coders soy un string muy largo`
    }
    res.status(200).send(string)
}
)

routerCookie.get('/users', (req, res) => {
    let users = []
    
    for (let i = 0; i < 10; i++) {
        users.push(generateUser())
    }

    res.send({
        status: 'success',
        payload: users
    })
})

routerCookie.get('/current', (req, res) => {
    res.send('datos sensibles que solo puede ver el admin')
})

//session acceso y cantidad de visitas al sitio
routerCookie.get('/session', (req, res) => {
if(req.session.counter){
    req.session.counter++
    res.send(`se ha visitado el sitio ${req.session.counter} veces.`)
}else{
    req.session.counter = 1
    res.send('Bienvenidos')
}
})

// Crear endpoint para metodos de cookie
routerCookie.get('/setCookie', (req, res) => {
    //res vamos a mandar una orden al navegador
    res.cookie('cookie','mensaje por cookie', {maxAge: 1000000}).send('cookieRespuesta')
})

// Crear endpoint para metodos de cookie firmada
routerCookie.get('/setCookieSigned', (req, res) => {
    //res vamos a mandar una orden al navegador
    res.cookie('cookie','mensaje por cookie', {maxAge: 1000000, signed: true}).send('cookie signed')
})

routerCookie.get('/getCookie', (req, res) => {
    res.send(req.signedCookies)
})

// Eliminar cookie
routerCookie.get('/deleteCookie', (req, res) => {
    res.clearCookie('cookie').send('cookie borrada')
})

export default routerCookie