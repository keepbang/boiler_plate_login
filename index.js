const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const {User} = require('./models/User');
const config = require('./config/key');
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!~~Hi'));

app.post('/register', (req, res) => {
    //회원가입에 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);
    //mongoDB에서 쓰는 메소드
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success:true,
            userInfo
        })
    });

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));