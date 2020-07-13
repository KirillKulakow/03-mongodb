module.exports = {
    mongoose: {
      connectionUrl: process.env.MONGODB_CONNECTION_URL
    },
    server: {
      port: process.env.PORT,
    }
  }