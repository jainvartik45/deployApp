
import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import postRouter from './routes/posts.js'
import userRouter from './routes/users.js'
import path from 'path'
import morgan from 'morgan'

const app = express();
const __dirname = path.resolve(path.dirname('')); 

app.use(express.static(path.join(__dirname,'./client/build')))
app.use(morgan("dev"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts',postRouter);
app.use('/user' , userRouter)

const PORT = process.env.PORT || 5000;

// mongodb+srv://vartikjain:akashhaibhadwa@cluster0.c3hlq1z.mongodb.net/?retryWrites=true&w=majority
const CONNECTION_URL ='mongodb://vartikjain:akashhaibhadwa@ac-c70oitz-shard-00-00.c3hlq1z.mongodb.net:27017,ac-c70oitz-shard-00-01.c3hlq1z.mongodb.net:27017,ac-c70oitz-shard-00-02.c3hlq1z.mongodb.net:27017/?ssl=true&replicaSet=atlas-135p9b-shard-0&authSource=admin&retryWrites=true&w=majority'
// mongodb://vartikjain:akashhaibhadwa@ac-c70oitz-shard-00-00.c3hlq1z.mongodb.net:27017,ac-c70oitz-shard-00-01.c3hlq1z.mongodb.net:27017,ac-c70oitz-shard-00-02.c3hlq1z.mongodb.net:27017/?ssl=true&replicaSet=atlas-135p9b-shard-0&authSource=admin&retryWrites=true&w=majority


mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log('Connected')))
  .catch((error) => console.log(`${error} did not connect`));

// mongoose.set('useFindAndModify', false);


