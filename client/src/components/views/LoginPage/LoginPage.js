import React,{useState} from 'react'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action'
import {withRouter} from 'react-router-dom'

function LoginPage(props) {

    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value)
    }

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault() //페이지 재랜더링 막기
        
        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('/')
                }else{
                    alert('Error')
                }
            })
    }

    const onRegisterHandler = (e) => {
        e.preventDefault()
        props.history.push('/register')

    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width:'100%', height: '100vh'
        }}>
            <form style={{ display:'flex', flexDirection:'column' }}
                  onSubmit={onSubmitHandler}
                >

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button style={{marginBottom : '5px'}}>
                    Login
                </button>
                <button type="button" onClick={onRegisterHandler}>
                    회원 가입
                </button>
            </form> 
            
        </div>
    )
}

export default withRouter(LoginPage)
