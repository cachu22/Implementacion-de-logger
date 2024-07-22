import { Router } from "express";
import { generateProducts } from "../../utils/generateProductsMock.js";

export const mocking = Router()

mocking.get ('/', (req, res) => {
    let products =[]

    for (let i = 0; i < 100; i++) {
        products.push(generateProducts());
    }

    res.send({
        status: 'success',
        payload: products
    });
});