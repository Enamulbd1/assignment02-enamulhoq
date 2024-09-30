import { test, expect } from '@playwright/test';
import { faker} from "@faker-js/faker"


test.describe('Test Suite 01- car rental test', () => {
  test('Test case 01-check all the cars', async ({ request }) => {
    const getPostsResponse = await request.get('http://localhost:9090/api/v1/allcars');
    expect (getPostsResponse.ok()).toBeTruthy();
    expect ( getPostsResponse.status()).toBe(200);
  })

   test('Test case 02 - create post to the cars', async ({ request }) => {
    
    const uniqueRegistrationNumber = faker.vehicle.vin();
    const carDetails = { 
      pricePerDay: parseFloat(faker.finance.amount()),
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

  //  POST request to add a new customer
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

test('Test case 05 - delete a car by ID', async ({ request }) => {
  // Get the list of all cars
  const getPostsResponse = await request.get('http://localhost:9090/api/v1/allcars');
  expect(getPostsResponse.ok()).toBeTruthy();
  
   const allCustomers = await getPostsResponse.json();

   const lastButOneCustomerID = allCustomers[allCustomers.length - 2].id;
  
   const deleteCustomerResponse = await request.delete(`http://localhost:9090/api/v1/deletecar/${lastButOneCustomerID}`);
   expect(deleteCustomerResponse.status()).toBe(404);

   const getDeletedCarResponse = await request.get(`http://localhost:9090/api/v1/getcar/${lastButOneCustomerID}`);
   expect(getDeletedCarResponse.status()).toBe(404);
  
  
});

test('Test case 06 - update a car by ID', async ({ request }) => {
  const getAllCustomers = await request.get('http://localhost:9090/api/v1/allcars');
  expect(getAllCustomers.ok()).toBeTruthy();
  
  const allCustomers = await getAllCustomers.json();
  const customerToUpdate = allCustomers[1];
  const customerID = customerToUpdate.id;

  // new data for the car update
  const updatedCustomerDetails = {
    id: customerID,
    pricePerDay: parseFloat(faker.finance.amount()),
    fabric: faker.vehicle.color(),     
    model: faker.vehicle.model(), 
    registrationNumber: faker.vehicle.vin(),
    isBooked: false
  };

  const updateCustomerResponse = await request.put("http://localhost:9090/api/v1/updatecar", {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(updatedCustomerDetails), // Passing the updated car details in the request body
  });
   expect(updateCustomerResponse.ok()).toBeTruthy();

   const getUpdatedCarResponse = await request.get("http://localhost:9090/api/v1/allcars");
  expect(getUpdatedCarResponse.ok()).toBeTruthy();

});

test('Test case 07 - update a customer by ID', async ({ request }) => {
  const getAllCustomers = await request.get('http://localhost:9090/api/v1/customers');
  expect(getAllCustomers.ok()).toBeTruthy();

  const allCustomers = await getAllCustomers.json();
  const customerToUpdate = allCustomers[5];
  const customerID = customerToUpdate.id;

  // new data for the customer update
  const updatedCustomerDetails = {
    id: customerID,
    username: "Mehmet01",
    name: "Mehmet",
    address: "sollentuna",
    email: "mehmet@gmail.com",
   phoneNumber: "0763908046"
  };

  const updateCustomerResponse = await request.put("http://localhost:9090/api/v1/updatecustomer", {
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(updatedCustomerDetails), // Passing the updated customer details in the request body
  });
   expect(updateCustomerResponse.ok()).toBeTruthy();

  const getUpdatedCustomerResponse = await request.get("http://localhost:9090/api/v1/customers");
  expect(getUpdatedCustomerResponse.ok()).toBeTruthy();
});

test('Test case 08 - delete a customer by ID', async ({ request }) => {
  // Get the list of all customers
  const getPostsResponse = await request.get('http://localhost:9090/api/v1/customers');
  expect(getPostsResponse.ok()).toBeTruthy();
  
   const allCustomers = await getPostsResponse.json();

   const lastButOneCustomerID = allCustomers[allCustomers.length - 3].id;
  
   const deleteCustomerResponse = await request.delete(`http://localhost:9090/api/v1/deletecustomer/${lastButOneCustomerID}`);
   expect(deleteCustomerResponse.status()).toBe(404);

   const getDeletedCustomerResponse = await request.get(`http://localhost:9090/api/v1/customers/${lastButOneCustomerID}`);
   expect(getDeletedCustomerResponse.status()).toBe(404); 
});

test('Test case 09 - check all the orders', async ({ request }) => {
  const getPostsResponse = await request.get('http://localhost:9090/api/v1/orders');
  expect (getPostsResponse.ok()).toBeTruthy();
  expect ( getPostsResponse.status()).toBe(200);
})

test('Test case 10 -post to myOrder', async ({ request }) => {
  const ordereData = {
      "id": 1
  }
   const addOrderResponse = await request.post('http://localhost:9090/api/v1/myorders', {
    data: ordereData 
});
  expect(addOrderResponse.ok()).toBeTruthy();
  expect(addOrderResponse.status()).toBe(200);
});

});



