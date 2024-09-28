import { test, expect } from '@playwright/test';
import { faker} from "@faker-js/faker"
import { json } from 'stream/consumers';
import exp from 'constants';


test.describe('Test Suite 01- car rental test', () => {
  test('Test case 01-check all the cars', async ({ request }) => {
    const getPostsResponse = await request.get('http://localhost:9090/api/v1/allcars');
    expect (getPostsResponse.ok()).toBeTruthy();
    expect ( getPostsResponse.status()).toBe(200);
  })

   test('Test case 02 - create post to the cars', async ({ request }) => {
    
    const uniqueRegistrationNumber = faker.vehicle.vin(); // Generates a random number for id
    const carDetails = { 
      pricePerDay: parseFloat(faker.finance.amount()),  // Generates a random price
      fabric: faker.vehicle.color(),
      model: faker.vehicle.model(),
      registrationNumber: uniqueRegistrationNumber,
      isBooked: false
    }

    const createPostsResponse = await request.post('http://localhost:9090/api/v1/addcar', {
      headers: { 
        'content-type' : 'application/json' },
      
        data: carDetails ,  
    });
    
    expect (createPostsResponse.ok()).toBeTruthy();
    expect (await createPostsResponse.json()).toMatchObject(
      expect.objectContaining({
    
        pricePerDay:carDetails.pricePerDay,
        fabric:carDetails.fabric,
        model:carDetails.model,
        registrationNumber:carDetails.registrationNumber,
      })
    ) 
  })
  
  test('Test case 03-check all the customers', async ({ request }) => {
    const getPostsResponse = await request.get('http://localhost:9090/api/v1/customers');
    expect (getPostsResponse.ok()).toBeTruthy();
    expect ( getPostsResponse.status()).toBe(200);
  })

test('Test case 04 - create post to add a customer', async ({ request }) => {
  // Generate fake customer data
  const customerData = {
    username: faker.internet.userName(), 
    name: faker.name.fullName(),               
    address: faker.address.streetAddress(),     
    email: faker.internet.email(),              
    phoneNumber: faker.phone.number(),          
  };

  // Send a POST request to add a new customer
  const createCustomerResponse = await request.post('http://localhost:9090/api/v1/addcustomer', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: customerData,
  });
  expect(createCustomerResponse.ok()).toBeTruthy();
  const responseData = await createCustomerResponse.json();
  //  Verify the response matches the sent data
  expect(responseData).toMatchObject({
    username: customerData.username,
    name: customerData.name,
    address: customerData.address,
    email: customerData.email,
    phoneNumber: customerData.phoneNumber,
  });
});

test('Test case 05- delete a car by ID', async ({ request }) => {
  const getPostsResponse = await request.get('http://localhost:9090/api/v1/deletecar');
  expect (getPostsResponse.ok()).toBeTruthy();
  const allCars = await getPostsResponse.json();
  const lastButOneCarID = allCars[allCars.length - 2].id;
  // expect ( getPostsResponse.status()).toBe(200);
})


  
});


