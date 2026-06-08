import { useState, useEffect, useReducer } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  KeyRound,
  Mail,
  ALargeSmall,
  UserKey,
  EyeOff,
  Eye,
} from 'lucide-react';
import sampleUserList from '../../data/SampleUserList';
import { toast } from 'sonner';

const initialState = {
  username: '',
  role: '',
  email: '',
  password: '',
  errors: {},
  isSubmitting: false,
  loading: false,
};

const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SUBMIT: 'SUBMIT',
  RESET: 'RESET',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
};

function registerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
        errors: {
          ...state.errors,
          [action.field]: null, // Clear value on change
        },
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.msg,
        },
      };

    case ACTIONS.SUBMIT:
      return {
        ...state,
        isSubmitting: action.value,
      };

    case ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
      };

    case ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

function RegisterForm({ setUser }) {
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const [userList, setUserList] = useState(sampleUserList);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('There are changes in userList: ', userList);
  }, [userList]);

  async function sampleRegisterAPI(state) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(state);

    const emailExists = userList.find((u) => u.email === state.email);
    if (emailExists) throw new Error('Email already registered');

    const newUser = {
      id: Date.now(), // Change to increment id later
      username: state.username,
      role: state.role,
      email: state.email,
      password: state.password,
    };

    const updatedUserList = [...userList, newUser];
    setUserList(updatedUserList);
    // Pass the  updated registeredUserList to login page
    return newUser;
  }

  const validateForm = () => {
    let isValid = true;
    if (!state.email.includes('@')) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        field: 'email',
        msg: 'Invalid email',
      });
      isValid = false;
    }

    return isValid;
  };

  const handleChange = (e) => {
    dispatch({
      type: ACTIONS.SET_FIELD,
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // TODO Handle registration via backend API, Simulate API for now
    e.preventDefault();
    dispatch({ type: ACTIONS.REGISTER_START });

    try {
      if (!validateForm()) return;
      dispatch({ type: ACTIONS.SUBMIT, value: true });
      const newUser = await sampleRegisterAPI(state);

      // Direct login after register
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);

      dispatch({ type: ACTIONS.REGISTER_SUCCESS });
      toast.success('Account created! Welcome to Callio.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      dispatch({
        type: ACTIONS.REGISTER_ERROR,
        payload: err.message,
      });
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
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center p-8 bg-base-100">
          <div className="w-full max-w-full">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-base-content">
                Create an account
              </h1>
              <p className="text-2xl text-base-content/50 mt-1">
                Join Callio to manage your leads
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <label className="label">Username</label>
                <label className="input validator w-full">
                  <ALargeSmall size={15} className="text-base-content/40" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    name="username"
                    value={state.username}
                    onChange={handleChange}
                  />
                </label>
                <div className="validator-hint hidden">
                  Please enter your username
                </div>
                <label className="label">Role</label>
                <label className="input validator w-full">
                  <UserKey size={15} className="text-base-content/40" />
                  <select
                    name="role"
                    className="bg-transparent grow h-full focus:outline-none"
                    value={state.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled={true}>
                      Pick a role
                    </option>
                    <option value="team_lead">Team Lead</option>
                    <option value="agent">Agent</option>
                  </select>
                </label>
                <label className="label">Email</label>
                <label className="input validator w-full">
                  <Mail size={15} className="text-base-content/40" />
                  <input
                    type="email"
                    placeholder="mail@site.com"
                    required
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                  />
                </label>
                <div className="validator-hint hidden">
                  Please enter a valid email address
                </div>
                <label className="label">Password</label>
                <label className="input validator w-full">
                  <KeyRound size={15} className="text-base-content/40" />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    // minLength="8"
                    // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    name="password"
                    value={state.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-base-content/40 hover:text-base-content"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </label>
                <p className="validator-hint hidden">
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </p>
                <div>
                  <p>
                    Already Have An Account?
                    <Link to="/login" className="link link-primary link-hover">
                      Sign In
                    </Link>
                  </p>
                </div>
                {state.loading ? (
                  <button className="btn btn-neutral w-full mt-6" disabled>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Account...
                  </button>
                ) : (
                  <button className="btn btn-neutral w-full mt-6" type="submit">
                    Create New Account
                  </button>
                )}
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
