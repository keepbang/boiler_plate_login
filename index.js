const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {User} = require('./models/User');
const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());

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


app.post('/login',(req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email},(err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이베일이 데이터베이스에있을때 비밀번호가 같은지 확인한다.
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            //비밀번호가 맞으면 토큰 생성
            user.generateToken((err,user) => {
                 if(err) return res.status(400).send(err);
                //토큰을 저장한다.
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));