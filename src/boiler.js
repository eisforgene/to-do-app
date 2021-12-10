// const { ApolloServer, gql } = require("apollo-server");
// const { MongoClient } = require("mongodb");
// const dotenv = require("dotenv");
// dotenv.config();

// const { DB_URI, DB_NAME } = process.env; // taking .env information and putting it into process.env

// const books = [
//   {
//     title: "The Awakening",
//     author: "Kate Chopin",
//   },
//   {
//     title: "City of Glass",
//     author: "Paul Auster",
//   },
// ];

// const typeDefs = gql`
//   type Query {
//     books: [Book]
//   }

//   type Book {
//     title: String
//     author: String
//   }
// `;

// // Resolvers = how we get data from specific fields
// // They have same structure as typeDefs
// const resolvers = {
//   Query: {
//     books: (root, data, context) => { // context (DB is being passed through query now)
//       console.log(context); // shows that context (DB) is being passed in query and that we can access it here
//       return books;
//     },
//   },
// };

// // console.log(DB_URI); // check to see if it is reading it correctly
// const start = async () => {
//   // Create connection to DB before connecting to server
//   const client = new MongoClient(DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }); // altered uri to DB_URI
//   await client.connect();
//   const db = client.db(DB_NAME); // allows it easier to access tables

//   const context = { // add context (context of our DB) to new ApolloServer so that it will be included in every query/mutation
//     db, 
//   }

//   // The ApolloServer constructor requires two parameters: your schema
//   // definition and your set of resolvers.
//   const server = new ApolloServer({ typeDefs, resolvers, context }); // added context object here

//   // The `listen` method launches a web server.
//   server.listen().then(({ url }) => {
//     console.log(`🚀  Server ready at ${url}`);
//   });
// };

// start();
