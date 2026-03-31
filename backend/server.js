const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/publications', require('./routes/publicationRoutes'));

app.use(require('./middleware/errorMiddleware'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// ── GraphQL ──
const startServer = async () => {
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use('/graphql', expressMiddleware(apollo, { context }));

  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
    console.log('GraphQL: http://localhost:5000/graphql');
  });
};

startServer();