import { faker } from '@faker-js/faker'
import crypto from 'crypto'

export function generateSingleProduct() {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: parseInt(faker.string.numeric()),
        description: faker.commerce.productDescription(),
        id: faker.database.mongodbObjectId(),
        thumbnail: faker.image.url()
    };
}

export function generateProducts(count = 100) {
    const products = [];
    
    for (let i = 0; i < 100; i++) {
        products.push(generateSingleProduct());
    }
    return products;
}