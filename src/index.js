const { ApolloServer, gql } = require('apollo-server'); 

const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];

const typeDefs = gql`
  type Query {
    books: [Book]
  }

  type Book {
    title: String
    author: String
  }  
 
`;

// Resolvers = how we get data from specific fields
// They have same structure as typeDefs
const resolvers = {
    Query: {
      books: () => books,
    },
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});