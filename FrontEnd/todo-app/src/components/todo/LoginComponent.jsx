import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./security/AuthContext"

export default function LoginComponent() {

    const [username, setUsername] = useState("vikas")
    const [password, setPassword] = useState("vikas")
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const navigate = useNavigate('');
    const authContext = useAuth();

    function handleUsernameChange(event){
        setUsername(event.target.value)
    }

    function handlePasswordChange(event){
        setPassword(event.target.value)
    }

    async function handleSubmit(event) {
        if(await authContext.login(username, password)) {
            navigate(`/welcome/${username}`)
        }
        else{
            setShowErrorMessage(true)
        }
    }

    return(
        <div className="Login">
            <h1>Time to login!</h1>
            {/* <SuccessMessageComponent />
            <ErrorMessageComponent /> */}
            
            {showErrorMessage && <div className='ErrorMessage'>Authenticated Failed. Please check your crdentials.</div>}

            <div className="LoginForm">
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} placeholder='username' onChange={handleUsernameChange}/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} placeholder='password' onChange={handlePasswordChange}/>
                </div>
                <div>
                    <button type="button" name="login" onClick={handleSubmit}>LOGIN</button>
                </div>
            </div>
        </div>
    )
}