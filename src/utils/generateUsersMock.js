import { faker } from '@faker-js/faker'
import crypto from 'crypto'

export function generateProducts(){
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        departament: faker.commerce.department(),
        stock: parseInt(faker.string.numeric()),
        description: faker.commerce.productDescription(),
        id: faker.database.mongodbObjectId(),
        thumbnail: faker.image.url()        
    }
}

export const generateUser = () => {
    //Cuantos productos agregamos como limite '0' - '9'
    let numOfProducts = parseInt(faker.string.numeric(1, {bannedDigits: ['0']}))
    let products = []
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProducts())
        
    }
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        id: faker.database.mongodbObjectId(),
        _id: crypto.randomUUID(),
        email: faker.internet.email(),
        products
    }
}