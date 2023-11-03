// import userResolver from '../dist/src/resolvers/userResolver'; // Import the createUserResolver function to test
// import UserDB from '../dist/src/config/dbConfig';
// import test from "node:test"; // Impor
//
// test('createUserResolver', () => {
//     beforeAll(async () => {
//         // Set up a testing database connection or use in-memory database like SQLite
//         await UserDB.sync({ force: true });
//     });
//
//     afterAll(async () => {
//         // Close the testing database connection or cleanup
//         await UserDB.close();
//     });
//
//     it('should create a user if email is not already taken', async () => {
//         const createUserInput = {
//             user: {
//                 email: 'newuser@example.com',
//                 username: 'username',
//                 password: 'password123'
//                 // Add other required user properties here
//             },
//         };
//
//         const result = await userResolver.Mutation.createUser(null, createUserInput);
//
//         const createdUser = await UserDB.findOne({ where: { email: 'newuser@example.com' }});
//         expect(createdUser).toMatchObject(createUserInput.user);
//         expect(result).toMatchObject(createUserInput.user);
//
//
// });
// //     it('should throw an error if email is already taken', async () => {
// //         const createUserInput = {
// //             user: {
// //                 email: 'existinguser@example.com', // Email already exists
// //                 // Add other required user properties here
// //             },
// //         };
// //
// //         // Manually create a user with the same email
// //         await UserDB.create(createUserInput.user);
// //
// //         const mockThrowCustomError = jest.requireMock('../util/error-handler.js');
// //
// //         await userResolver.Mutation.createUser(null, createUserInput);
// //     });
// // });
//     });
