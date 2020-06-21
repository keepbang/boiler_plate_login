const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./server/config/key');

const { User } = require('./server/models/User');

const { auth } = require('./server/middleware/auth');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!~~Hi'));

app.post('/api/users/register', (req, res) => {
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
    })
})


app.post('/api/users/login',(req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email},(err, user) => {
        if(err) return err

        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이베일이 데이터베이스에있을때 비밀번호가 같은지 확인한다.
        user.comparePassword(req.body.password, (err,isMatch) => {
            if(err) return err

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
})

app.get('/api/users/auth', auth , (req,res) => {
    res.status(200).json({
        _id:req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


app.get('/api/users/logout', auth, (req,res) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},
        (err,user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));