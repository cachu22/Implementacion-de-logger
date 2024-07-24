import nodemailer from 'nodemailer';
import { objectConfig } from '../config/index.js';
import { logger } from './logger.js';

const { gmail_pass, gmail_user } = objectConfig;

// Configuración del transportador de correo
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // Cambiar a true para puerto 465
    auth: {
        user: gmail_user,
        pass: gmail_pass
    },
    tls: {
        rejectUnauthorized: false
    }
});
logger.info('Transportador de correo configurado con usuario - src/utils/sendMail.js:', gmail_user);

export const sendEmail = async ({ email, subject, html }) => {
    try {
        const info = await transport.sendMail({
            from: 'Coder Backend Test',
            to: email, // Utiliza la variable `email` proporcionada en la función
            subject,
            html,
            attachments: [{
                filename: 'logo-inicio.png',
                path: './src/Public/img/logo-inicio.png',
                cid: 'node.js'
            }]
        });
        logger.info('Correo electrónico enviado exitosamente - src/utils/sendMail.js:', info.messageId);
        return info;
    } catch (error) {
        logger.error('Error al enviar el correo electrónico - src/utils/sendMail.js:', error);
        throw error;
    }
};