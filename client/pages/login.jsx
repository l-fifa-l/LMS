import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //state
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  // const { user } = state;

  //router
  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push('/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log({ name, password, email });
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      console.log('REGISTER RESPONSE', data);
      dispatch({
        type: 'LOGIN',
        payload: data,
      });

      // save in the user in local storage
      window.localStorage.setItem('user', JSON.stringify(data));
      //redirect
      router.push('/user');
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center pt-5 square">Login</h1>
      <div className="container col-md-3 offset-md-4 pd-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="form-control mb-4 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <br />
          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>
        <p className="text-center pt-3">
          Not yet registered?{' '}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>

        <p className="text-center ">
          <Link href="/forgot-password">
            <a className="text-danger">Forgot password</a>
          </Link>
        </p>
      </div>
    </>
  );
}
