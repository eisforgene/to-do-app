const { ApolloServer, gql } = require("apollo-server");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs');
dotenv.config();

const { DB_URI, DB_NAME } = process.env; // taking .env information and putting it into process.env

const typeDefs = gql`
  type Query {
    myTaskLists: [TaskList!]
  }
  
  type Mutation {
    signUp(input: SignUpInput): AuthUser! 
    signIn(input: SignInInput): AuthUser!
  }

  input SignUpInput { 
    email: String!
    password: String!
    name: String!
    avatar: String
  }

  input SignInInput { 
    email: String!
    password: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }
  
  type TaskList {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!

    users: [User!]!
    todos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!

    taskList: TaskList!
  }
`;

const resolvers = {
  Query: {
    myTaskLists: () => []
  },
  Mutation: {
    signUp: async (_, { input }, { db }) => {
      const hashedPassword = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: hashedPassword
      }
      // save to DB
      const result = await db.collection('Users').insert(newUser);
      const user = newUser


      return {
        user,
        token: 'token'
      }

    },
    signIn: async (_, { input }, { db }) => {
      const user = await db.collection('Users').findOne({ email: input.email })
      if (!user) {
        throw new Error('Invalid Credentials!');
      }

      // check if password is correct
      const isCorrectPassword = bcrypt.compareSync(input.password, user.password) // compare unhashed vs hashed to see if it is correct
      if (!isCorrectPassword) {
        throw new Error('Invalid Credentials!');
      }

      return {
        user,
        token: 'token'
      }
    }
  },

  User: {
    id: ({ _id, id }) => _id || id
  }
};

// console.log(DB_URI); // check to see if it is reading it correctly
const start = async () => {
  // Create connection to DB before connecting to server
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); // altered uri to DB_URI
  await client.connect();
  const db = client.db(DB_NAME); // allows it easier to access tables

  const context = {
    // add context (context of our DB) to new ApolloServer so that it will be included in every query/mutation
    db,
  };

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({ typeDefs, resolvers, context }); // added context object here

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
