import jwt from 'jsonwebtoken'
import { PRIVATE_KEY } from '../utils/jwt.js';
import { userService } from '../service/index.js';

// Middleware de autorización para administradores y usuarios normales
export function adminOrUserAuth(req, res, next) {
    if (req.session.user) {
        next(); // Permitir acceso si hay una sesión de usuario válida
    } else {
        res.status(403).send('Acceso denegado: Debes iniciar sesión');
    }
}

// Middleware de autorización solo para administradores
export function adminAuth(req, res, next) {
    if (req.session?.user?.isAdmin) {
        next(); // Permitir acceso si es un administrador
    } else {
        res.status(401).send('Acceso no autorizado');
    }
}

// export function userAuth(req, res, next) {
//     console.log('Session:', req.session);
//     console.log('Session User:', req.session.user);
//     if (req.session && req.session.user) {
//         next();
//     } else {
//         res.status(401).send('Acceso no autorizado');
//     }
// }

export function userAuth(req, res, next) {
    console.log('Session User:', req.session.user); // Log para verificar la sesión
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send('Acceso no autorizado');
    }
}


// export const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) return res.status(401).send({ status: 'error', message: 'Token no proporcionado' });

//     jwt.verify(token, PRIVATE_KEY, (err, user) => {
//         if (err) return res.status(403).send({ status: 'error', message: 'Token inválido' });
//         req.user = user;
//         next();
//     });
// };

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({ status: 'error', message: 'Token no proporcionado' });

    jwt.verify(token, PRIVATE_KEY, (err, user) => {
        if (err) return res.status(403).send({ status: 'error', message: 'Token inválido' });
        req.user = user;
        next();
    });
};

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    try {
        console.log('Token received:', token);
        const decoded = jwt.verify(token, PRIVATE_KEY);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
};