import { useState, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import axios from 'axios';

const initialState = {
  email: '',
  password: '',
  loading: false,
  loggedIn: false,
};

const ACTIONS = {
  SET_EMAIL: 'SET_EMAIL',
  SET_PASSWORD: 'SET_PASSWORD',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
};

function loginReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };

    case ACTIONS.SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };

    case ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        loggedIn: false,
        error: '',
      };

    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: true,
      };

    case ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

function LoginForm() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'http://localhost:8000';

  async function loginAPI(email, password) {
    const response = await axios.post(`${API_URL}/login`, null, {
      params: { email: email, password: password },
    });
    console.log(response.data);
    return response.data;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.LOGIN_START });

    try {
      const user = await loginAPI(state.email, state.password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      dispatch({ type: ACTIONS.LOGIN_SUCCESS });
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      dispatch({ type: ACTIONS.LOGIN_ERROR, payload: err.message });
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left — branding */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 bg-neutral text-neutral-content"
          style={{
            backgroundImage: "url('/Menara118.jpg')",
            backgroundSize: 'cover',
          }}
        >
          <span className="font-bold text-3xl">CALLIO</span>
          <blockquote className="text-lg opacity-80">
            {/* "Manage your leads and track every conversation." */}
          </blockquote>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center p-8 bg-base-100">
          <div className="w-full max-w-full">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-base-content">
                Welcome back
              </h1>
              <p className="text-2xl text-base-content/50 mt-1">
                Sign in to your Callio account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset gap-1">
                {/* Email */}
                <legend className="fieldset-legend">Email</legend>
                <label className="input input-bordered validator w-full">
                  <Mail size={15} className="text-base-content/40" />
                  <input
                    type="email"
                    placeholder="mail@site.com"
                    required
                    value={state.email}
                    onChange={(e) =>
                      dispatch({
                        type: ACTIONS.SET_EMAIL,
                        payload: e.target.value,
                      })
                    }
                  />
                </label>

                {/* Password */}
                <legend className="fieldset-legend mt-2">Password</legend>
                <label className="input input-bordered validator w-full">
                  <KeyRound size={15} className="text-base-content/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={state.password}
                    onChange={(e) =>
                      dispatch({
                        type: ACTIONS.SET_PASSWORD,
                        payload: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-base-content/40 hover:text-base-content"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </label>

                {/* Error message */}
                {state.error && (
                  <div className="alert alert-error text-sm py-2 mt-2">
                    {state.error}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <a
                    className="link link-primary link-hover text-sm"
                    onClick={() =>
                      document
                        .getElementById('forgot_password_modal')
                        .showModal()
                    }
                  >
                    Forgot password?
                  </a>
                  <p className="text-sm text-base-content/60">
                    Do Not Have An Account?{' '}
                    <Link
                      to="/register"
                      className="link link-primary link-hover"
                    >
                      Register
                    </Link>
                  </p>
                </div>

                {state.loading ? (
                  <button className="btn btn-neutral w-full mt-4" disabled>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </button>
                ) : (
                  <button className="btn btn-neutral w-full mt-4" type="submit">
                    Login
                  </button>
                )}
                <div className="divider text-xs text-base-content/40">
                  OR CONTINUE WITH
                </div>
                <button className="btn btn-outline w-full gap-2" disabled>
                  <FcGoogle />
                  Login with Google
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>

      <dialog id="forgot_password_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Verify Email!</h3>
          <p className="py-4">
            Please enter your email to reset your password.
          </p>
          <label className="input validator w-full">
            <Mail size={15} className="text-base-content/40" />
            <input
              type="email"
              placeholder="mail@site.com"
              required
              // value={state.email}
              // onChange={(e) =>
              //   dispatch({
              //     type: "SET_EMAIL",
              //     payload: e.target.value,
              //   })
              // }
            />
          </label>
          <div className="validator-hint hidden">
            Please enter a valid email address
          </div>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-4">
                <button className="btn btn-neutral px-4 py-2 rounded">
                  Close
                </button>
                <button className="btn btn-neutral px-4 py-2 rounded">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default LoginForm;
