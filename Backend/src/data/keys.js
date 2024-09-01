require('dotenv').config({ path: '../data/.env'})

module.exports={
    MONGOURL: process.env.DATABASE_URL
}