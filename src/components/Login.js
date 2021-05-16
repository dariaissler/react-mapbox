import './login.css';
import {useState, useRef} from 'react';
import axios from 'axios';
import { Close } from '@material-ui/icons';

export const Login = ({setShowLoginForm, storage, setCurrentUser}) => {
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        };
        try {
          const res = await axios.post("/auth/login", user);
          storage.setItem('user', res.data.username);
          setCurrentUser(res.data.username);
          setShowLoginForm(false);
          setError(false);
        }catch (err) {
          setError(true);
        }
    };

    return (
        <div className="login_container">
            <form className="login_form" onSubmit={handleSubmit}>
                <input ref={nameRef} type="text" placeholder="username"/>
                <input ref={passwordRef} type="password" placeholder="password"/>
                <button>Login</button>
                { error && 
                <span className="failure">Something went wrong</span>
                }
            </form>
            <Close onClick={() => setShowLoginForm(false)}
            className="login-cancel"/>
        </div>
    )
}
