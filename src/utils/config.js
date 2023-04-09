import "dotenv/config"

const config = {
  port: process.env.PORT,
  db: {
    uri: process.env.DB_URI,
  },
  security: {
    jwt: {
      expiresIn: "2 days",
      secret: process.env.SECURITY_JWT_SECRET,
    },
    password: {
      saltLen: 128,
      keylen: 256,
      iterations: 100000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
    },
  },
}

export default config
