import { Router } from "express";
import fs from 'fs';
import { __dirname } from "../utils/utils.js";
import { multerSingleUploader } from "../utils/multer.js";
import CartDaoMongo from "../daos/MONGO/MONGODBNUBE/cartsDao.mongo.js";
import { adminOrUserAuth, adminAuth } from "../middlewares/Auth.middleware.js";
import { ProductService } from "../service/index.js";
import { logger } from "../utils/logger.js";

// Cargar los datos de productos localfile
const productsData = JSON.parse(fs.readFileSync(__dirname + '/file/products.json', 'utf-8'));

// Asigna los datos de productos existentes a la variable `products`
let products = productsData;

const viewsRouter = new Router();
const manager = new CartDaoMongo();

viewsRouter.get('/', async (req, res) => {
    const { numPage, limit } = req.query;
    try {
        // Consulta todos los productos desde la base de datos utilizando el manager de productos de Mongo
        const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await ProductService.getAll({ limit, numPage });

        // Verificar si el usuario está autenticado
        const user = req.session.user || {};

        // Renderiza la página principal (home) y pasa los productos como datos para su renderización
        res.render('home', {
            products: docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            isAdmin: user.isAdmin || false
        });

        logger.info('Página principal renderizada con productos - src/Routes/views.router.js', { products: docs });
    } catch (error) {
        logger.error('Error al obtener los productos - src/Routes/views.router.js:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para agregar un nuevo producto DB
// Controlador de ruta para agregar un nuevo producto
async function addProduct(req, res) {
    const newProductData = req.body;
    try {
        const newProduct = await productsManager.addProduct(newProductData);
        res.status(201).json(newProduct); // Respuesta con el nuevo producto creado

        logger.info('Nuevo producto agregado - src/Routes/views.router.js:', { newProduct });
    } catch (error) {
        logger.error('Error al agregar el producto - src/Routes/views.router.js:', error);
        res.status(500).json({ error: error.message }); // Manejo de errores
    }
}

viewsRouter.get('/login', (req, res) => {
    res.render('login');
    logger.info('Página de login renderizada - src/Routes/views.router.js');
});

viewsRouter.get('/current', (req, res) => {
    res.render('current');
    logger.info('Página de información del usuario actual renderizada - src/Routes/views.router.js');
});

viewsRouter.post('/login', (req, res) => {
    const user = getUserFromDatabase(req.body.email);

    // Establecer la sesión del usuario
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        admin: user.role === 'admin' // Establecer 'admin' en función del rol del usuario
    };

    res.redirect('/adminlogin');
    logger.info('Usuario autenticado y redirigido a /adminlogin - src/Routes/views.router.js', { user: req.session.user });
});

// Ruta usando adminOrUserAuth
viewsRouter.get('/adminlogin', adminOrUserAuth, (req, res) => {
    res.render('template-name', {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        isAdmin: req.session.user.isAdmin
    });
    logger.info('Página de administración renderizada para el usuario - src/Routes/views.router.js', { user: req.session.user });
});

viewsRouter.get('/check-session', (req, res) => {
    res.json(req.session.user);
    logger.info('Verificación de sesión realizada - src/Routes/views.router.js', { sessionUser: req.session.user });
});

// Ruta usando adminAuth
viewsRouter.get('/admin/products', adminAuth, (req, res) => {
    res.render('admin-products', {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        isAdmin: req.session.user.isAdmin
    });
    logger.info('Página de productos de administración renderizada - src/Routes/views.router.js', { user: req.session.user });
});

// Ruta para la bienvenida (Datos del cliente)
viewsRouter.get('/welcome', adminOrUserAuth, (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('home', {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName
    });
    logger.info('Página de bienvenida renderizada para el usuario - src/Routes/views.router.js', { user: req.session.user });
});

viewsRouter.get('/register', (req, res) => {
    res.render('register');
    logger.info('Página de registro renderizada - src/Routes/views.router.js');
});

viewsRouter.get('/GestionProductos', adminAuth, (req, res) => {
    res.render('GestionDeProductos');
    logger.info('Página de gestión de productos renderizada para el usuario - src/Routes/views.router.js', { user: req.session.user });
});

viewsRouter.get('/realtimeproducts', adminOrUserAuth, (req, res) => {
    res.render('realTimeProducts', { products: productsData });
    logger.info('Página de productos en tiempo real renderizada - src/Routes/views.router.js', { products: productsData });
});

viewsRouter.get('/cart', adminOrUserAuth, (req, res) => {
    const cartToShow = cartData.find(cart => cart['id de carrito'] === 3);

    if (!cartToShow) {
        res.status(404).send('El carrito no fue encontrado');
        logger.warn('Carrito no encontrado - src/Routes/views.router.js', { cartId: 3 });
        return;
    }

    const cartInfo = {
        id: cartToShow['id de carrito'],
        products: cartToShow.products.map(product => ({
            id: product['id de producto'],
            quantity: product.quantity,
            thumbnails: product.thumbnails
        }))
    };

    res.use('realTimeProducts', { cart: cartInfo });
    logger.info('Carrito mostrado - src/Routes/views.router.js', { cart: cartInfo });
});

// Ruta para mostrar la vista de un carrito específico
viewsRouter.get('/carts/:cid', adminOrUserAuth, async (req, res) => {
    const { cid } = req.params;
    try {
        logger.info('ID del carrito - src/Routes/views.router.js:', cid); // Log para verificar el ID del carrito
        const result = await manager.getCartById(cid);
        logger.info('Datos del carrito - src/Routes/views.router.js:', result); // Log para verificar los datos del carrito

        if (!result) {
            res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
            logger.warn('Carrito no encontrado por ID - src/Routes/views.router.js', { cartId: cid });
        } else {
            // Convertir el resultado a un objeto plano
            const cart = result.toObject();
            const products = cart.products || [];
            res.render('cart', { cartId: cid, cart, products });
            logger.info('Carrito renderizado - src/Routes/views.router.js', { cartId: cid, cart });
        }
    } catch (error) {
        logger.error('Error al buscar el carrito por ID - src/Routes/views.router.js:', error);
        res.status(500).send({ status: 'error', message: 'Error al buscar el carrito por ID' });
    }
});

// Ruta para subir la imagen utilizando multer
viewsRouter.post('/upload-file', multerSingleUploader, adminOrUserAuth, (req, res) => {
    // Log de imagen subida
    logger.info('Imagen subida con éxito - src/Routes/views.router.js', { file: req.file });
    res.send('¡Imagen subida con éxito!');
});

// Ruta para agregar un nuevo producto
viewsRouter.post('/realtimeproducts', adminOrUserAuth, addProduct);

export default viewsRouter;