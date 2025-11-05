const express = require('express')
const app = express()
const PORT = 8000
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const path = require('path')
const authRoute = require('./routes/authRoute')
const cors = require('cors')
const cloudinaryRoutes = require('./routes/cloudinary');
const courseRoute = require('./routes/courseRoute');
const bookRoute = require('./routes/bookRoute');
const adRoute = require('./routes/adRoute');
const testRoute = require('./routes/testRoute');
// const fileUpload = require("express-fileupload");

dotenv.config()
app.use(express.json())
app.use(cors())




connectDB()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "/tmp/"
// }));

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', require('./routes/userRoute'))
app.use('/api/v1/techstack', require('./routes/techStackRoute'))
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/v1/courses', courseRoute );
app.use('/api/v1/ebooks', bookRoute );
app.use('/api/v1/ads', adRoute );
app.use('/api/test', testRoute );

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('frontend/build'))
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//     })
// }


app.listen(port=process.env.PORT||PORT, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
