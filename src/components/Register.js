import './register.css';
import {useState, useRef} from 'react';
import axios from 'axios';
import { Close } from '@material-ui/icons';

export const Register = ({setShowRegisterForm}) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };
        try {
          await axios.post("/auth/register", newUser);
          setError(false);
          setSuccess(true);
        }catch (err) {
          setError(true);
        }
    };

    return (
        <div className="register_container">
            <form className="register_form" onSubmit={handleSubmit}>
                <input ref={nameRef} type="text" placeholder="username"/>
                <input ref={emailRef} type="email" placeholder="email"/>
                <input ref={passwordRef} type="password" placeholder="password"/>
                <button>Register</button>
                { success && 
                <span className="success">Successful registration. Please, login</span> 
                }
                { error && 
                <span className="failure">Something went wrong</span>
                }
            </form>
            <Close onClick={() => setShowRegisterForm(false)}
            className="register-cancel"/>
        </div>
    )
}
