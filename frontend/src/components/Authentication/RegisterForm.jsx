import { useState, useReducer } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase';

import {
  KeyRound,
  Mail,
  ALargeSmall,
  UserKey,
  EyeOff,
  Eye,
  Building,
  Hash,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  first_name: '',
  last_name: '',
  role: '',
  email: '',
  password: '',
  registered_year: '',
  license_number: '',
  agency_branch: '',
  errors: {},
  isSubmitting: false,
  loading: false,
};

const ACTIONS = {
  SET_FIELD: 'SET_FIELD',
  SET_ERROR: 'SET_ERROR',
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

function parseFirebaseError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email already registered.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    default:
      return 'Registration failed. Please try again.';
  }
}

function RegisterForm() {
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    if (!state.role) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        field: 'role',
        msg: 'Please select a role',
      });
      isValid = false;
    }
    if (!state.email.includes('@')) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        field: 'email',
        msg: 'Invalid email',
      });
      isValid = false;
    }
    if (state.password.length < 8) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        field: 'password',
        msg: 'Password must be at least 8 characters',
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
    e.preventDefault();
    if (!validateForm()) return;
    dispatch({ type: ACTIONS.REGISTER_START });

    try {
      dispatch({ type: ACTIONS.SUBMIT, value: true });

      // Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state.email,
        state.password,
      );

      // Set dislay name in Firebase (optional but useful)
      await updateProfile(userCredential.user, {
        displayName: `${state.first_name} ${state.last_name}`,
      });

      // Get ID token
      const idToken = await userCredential.user.getIdToken();

      // Create DB profile backend
      const registerResponse = await axios.post(
        `${API_URL}/auth/register`,
        {
          first_name: state.first_name,
          last_name: state.last_name,
          role: state.role,
          email: state.email,
          password: state.password,
          registered_year: state.registered_year
            ? parseInt(state.registered_year)
            : null,
          license_number: state.license_number || null,
          agency_branch: state.agency_branch || null,
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        },
      );

      console.log('Register response:', registerResponse.data);
      localStorage.setItem(
        'userProfile',
        JSON.stringify(registerResponse.data),
      );

      dispatch({ type: ACTIONS.REGISTER_SUCCESS });
      toast.success('Account created! Welcome to Callio.');
      navigate('/');
    } catch (err) {
      // Firebase errors use err.code , Axios uses err.response
      const message = err.code
        ? parseFirebaseError(err.code)
        : err.response?.data?.detail || 'Registration failed.';
      dispatch({ type: ACTIONS.REGISTER_ERROR, payload: message });
      toast.error(message);
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
              <fieldset className="fieldset gap-1">
                {/* First Name + Last Name — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <legend className="fieldset-legend">First Name</legend>
                    <label className="input input-bordered w-full">
                      <ALargeSmall size={14} className="text-base-content/40" />
                      <input
                        type="text"
                        placeholder="John"
                        required
                        name="first_name"
                        value={state.first_name}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div>
                    <legend className="fieldset-legend">Last Name</legend>
                    <label className="input input-bordered w-full">
                      <ALargeSmall size={14} className="text-base-content/40" />
                      <input
                        type="text"
                        placeholder="Doe"
                        required
                        name="last_name"
                        value={state.last_name}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Role */}
                <div className="w-full">
                  <legend className="fieldset-legend mt-2">Role</legend>
                  <label className="input input-bordered w-full">
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
                  {state.errors.role && (
                    <p className="text-error-msg">{state.errors.role}</p>
                  )}
                </div>

                {/* Email */}
                <div className="w-full">
                  <legend className="fieldset-legend mt-2">Email</legend>
                  <label className="input input-bordered w-full">
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
                  {state.errors.email && (
                    <p className="text-error-msg">{state.errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="w-full">
                  <legend className="fieldset-legend mt-2">Password</legend>
                  <label className="input input-bordered w-full">
                    <KeyRound size={15} className="text-base-content/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Password"
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
                  {state.errors.password && (
                    <p className="text-error-msg">{state.errors.password}</p>
                  )}
                </div>

                {/* Divider professional details */}
                <div className="divider text-xs text-base-content/40 my-2">
                  PROFESSIONAL DETAILS
                </div>

                {/* Registered Year + License Number — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <legend className="fieldset-legend">Year Registered</legend>
                    <label className="input input-bordered w-full">
                      <Calendar size={14} className="text-base-content/40" />
                      <input
                        type="number"
                        placeholder="2020"
                        name="registered_year"
                        value={state.registered_year}
                        onChange={handleChange}
                        min="1990"
                        max={new Date().getFullYear()}
                      />
                    </label>
                  </div>
                  <div>
                    <legend className="fieldset-legend">License No.</legend>
                    <label className="input input-bordered w-full">
                      <Hash size={14} className="text-base-content/40" />
                      <input
                        type="text"
                        placeholder="ABCDE12345"
                        name="license_number"
                        value={state.license_number}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Agency Branch */}
                <div className="w-full">
                  <legend className="fieldset-legend mt-2">
                    Agency Branch
                  </legend>
                  <label className="input input-bordered w-full">
                    <Building size={15} className="text-base-content/40" />
                    <input
                      type="text"
                      placeholder="e.g. Kuala Lumpur HQ"
                      name="agency_branch"
                      value={state.agency_branch}
                      onChange={handleChange}
                    />
                  </label>
                  {/* General error */}
                  {state.error && (
                    <div className="alert alert-error text-sm py-2 mt-2">
                      {state.error}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-sm text-base-content/60">
                    Already have an account?{' '}
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
