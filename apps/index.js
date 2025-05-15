const express= require("express")
const mongoose= require("mongoose")
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const replyRoutes = require('./routes/reply');
const batchRoutes = require('./routes/batch');
const authRoutes = require('./routes/auth');
const AnonymousRoutes = require('./routes/Anonymous');
const AnonymousReplyRoutes = require('./routes/AnonymousReply');

const cors = require('cors');

const app= express()

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/reply', replyRoutes);
app.use('/api/anonymous/posts', AnonymousRoutes);
app.use('/api/anonymous/reply', AnonymousReplyRoutes);

mongoose.connect('mongodb+srv://vinaykesarwani583:nKgCsEqM0rxJrk4O@cluster0.eqj1hmh.mongodb.net/CRUD?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> {
  console.log("Connected to Data base");
})
.catch(()=> {
  console.log("Connected to Database Failed");
})

app.listen(3000, ()=> {
  console.log('Server is Running on port 3000');
})