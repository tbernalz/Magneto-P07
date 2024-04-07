import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './validations/LoginValidation';
import axios from 'axios';
import './css/profile.css';


function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values))
        if (errors.email === "" && errors.password === ""){
            axios.post('http://localhost:8081/login', values)
            .then(res => {
                if(res.data === "Success"){
                    navigate('/home');
                }else {
                    alert("No record exists");
                }
            })
            .catch(err => console.log(err));
        }
    }

  return (
    <section>

        <form  action='' onSubmit={handleSubmit}>

            <h2>Sign In</h2>
                <div className='inputbox'>
                    <ion-icon name='mail-outline'></ion-icon>
                    <label htmlFor='email'><strong>Correo</strong></label>
                    <input type="email" placeholder='Enter Email' name='email'
                    onChange={handleInput} className='form-control rounded-0' />
                    {errors.email && <span className='text-danger'> {errors.email}</span>}
                </div>

                <div className='inputbox2'>
                    <ion-icon name= 'locked-closed-outline'></ion-icon>
                    <label htmlFor='password'><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name='password'

                    onChange={handleInput} className='form-control rounded-0' />
                    {errors.password && <span className='text-danger'> {errors.password}</span>}
                </div>
                <div>
                    <button type='submit' className='button'>Log In</button>
                </div>
                <div>
                    <hr />
                    <p>I don't have an account</p>
                    <div>
                        <Link to="/signup" className='link'>Create account</Link>
                    </div>
                </div>
        </form>
        <div className='text'>Magneto07</div>
    </section>
  )
}

export default Login