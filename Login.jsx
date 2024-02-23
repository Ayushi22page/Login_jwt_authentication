import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/UseAuth';
 const Login = () => {

    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(()=>{
        userRef.current.focus();
    },[])

    useEffect(()=>{
        setErrMsg ('');

    },[user,pwd])

    const handlesubmit = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios.post(LOGIN_URL,
              JSON.stringify({user, pwd}),
              {
                headers: {'content-type': 'application/json'},
                withCredential : true
              }
                );
        console.log(JSON.stringify(response?.data));
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({user, pwd, roles, accessToken});
        setUser('');
        setPwd('');
        navigate(from, {replace: true});
    } catch(err){
        if(!err?.response){
            setErrMsg('No Server Response');
        }else if(err.response?.status ===400){
            setErrMsg('Missing Username or Password');
        }else if(err.response?.status ===401){
            setErrMsg('Unauthorized');
        }else{
            setErrMsg('Login Failed');
        }
        errRef.current.focus();
    }
    }


    return (
        <section className="justify-items-center w-5 caret-red-300">
            <p ref={errRef} className={errMsg ? "errmsg": "offscreen"}aria-live='assertive'>{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handlesubmit} className="caret-slate-500">
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    ref={userRef}
                    autoComplete='off'
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    required='true'

                />
                <label htmlFor='password'>Password:</label>
                <input
                    type='text'
                    id='password'
                    autoComplete='off'
                    value={pwd}
                    onChange={e => setPwd(e.target.value)}
                    required
                />

                <button>Sign In</button>
            </form>
            <p>
                Need an Account <br/>
                <span className='line'>
                    <Link to="/register"> Sing-Up</Link>
                </span>
            </p>

        </section>
    )
}

export default Login