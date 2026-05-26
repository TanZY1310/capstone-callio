import { useState, useEffect, useReducer, isValidElement } from "react";
import { Link } from "react-router-dom";

import { KeyRound, Mail, ALargeSmall, UserKey } from "lucide-react";
import sampleUserList from "../../data/SampleUserList";

const initialState = {
  username: "",
  role: "",
  email: "",
  password: "",
  errors: {},
  isSubmitting: false,
  loading: false,
  loggedIn: false,
};

const ACTIONS = {
  SET_FIELD: "SET_FIELD",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SUBMIT: "SUBMIT",
  RESET: "RESET",
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
        submitting: action.value,
      };

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
}

function RegisterForm() {
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const [userList, setUserList] = useState(sampleUserList);

  useEffect(() => {
    console.log("There are changes in userList: ", userList);
  }, [userList])

  async function sampleRegisterAPI(state) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(state);

    const newUser = {
      id: Date.now(),
      username: state.username,
      role: state.role,
      email: state.email,
      password: state.password
    };

    setUserList(prev => [...prev, newUser]);
    dispatch({ type: ACTIONS.RESET });
  }

  const validateForm = () => {
    let isValid = true;
    if (!state.email.includes("@")) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        field: "email",
        msg: "Invalid email",
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
    //Handle registration via backend API, Simulate API for now
    e.preventDefault();

    try {
      if (!validateForm()) return;
      dispatch({ type: ACTIONS.SUBMIT, value: true });
      await sampleRegisterAPI(state);
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, field: "email", msg: "Invalid email",})
    } finally {
    }
  };

  return (
    <>
      <div
        className="hero bg-base-200 min-h-screen"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left"></div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <fieldset className="fieldset">
                  <label className="label">Username</label>
                  <label className="input validator">
                    <ALargeSmall />
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      name="username"
                      value={state.username}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="label">Role</label>
                  <label className="label">
                    <UserKey />
                    <select name="role" className="select" value={state.role} onChange={handleChange}>
                      <option disabled={true}>Pick a role</option>
                      <option value="team_lead">Team Lead</option>
                      <option value="agent">Agent</option>
                    </select>
                  </label>
                  <label className="label">Email</label>
                  <label className="input validator">
                    <Mail />
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
                  <label className="input validator">
                    <KeyRound />
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
                      <Link
                        to="/login"
                        className="link link-primary link-hover"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                  <button className="btn btn-neutral mt-4" type="submit">
                    Create New Account
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
