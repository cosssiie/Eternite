const express = require('express');
const http = require('http'); // Нужно для Socket.io
const { ApolloServer } = require('@apollo/server');
const { Server } = require('socket.io');
const { expressMiddleware } = require('@as-integrations/express4');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');
const connectDB = require('./config/db');

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 5000;

  await connectDB();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });
  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('User connected to Socket.io:', socket.id);
    socket.on('disconnect', () => console.log('User disconnected'));
  });

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  app.use('/graphql', expressMiddleware(apollo, {
    context: async ({ req }) => ({
      ...context({ req }),
      io: app.get('io')
    })
  }));

  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/publications', require('./routes/publicationRoutes'));

  app.use(require('./middleware/errorMiddleware'));

  httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`Socket.io: Initialized`);
  });
};

startServer().catch(err => console.error('Server start error:', err));