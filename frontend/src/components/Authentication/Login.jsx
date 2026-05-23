import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";

import { KeyRound, Mail } from "lucide-react";

const initialState = {
  username: "",
  email: "",
  password: "",
  role: "",
  loading: false,
  loggedIn: false,
};

function loginReducer(state, action) {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };

    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
      };

    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        loggedIn: false,
        error: "",
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        loggedIn: true,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        loggedIn: true,
        error: action.payload,
      };

    default:
      return state;
  }
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [state, dispatch] = useReducer(loginReducer, initialState);

  const loginUser = () => {
    dispatch({ type: "LOGIN_START" });

    setTimeout(() => {
      if (state.email === "admin@gmail.com" && state.password === "123") {
        dispatch({ type: "LOGIN_SUCCESS" });
      } else {
        dispatch({ type: "LOGIN_ERROR", payload: "Invalid credentials" });
      }
    }, 1000);
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen" style={{ backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)" }}>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            {/* <h1 className="text-5xl font-bold">Login Page</h1>
            <p className="py-6">
              Enter a description here for login later
            </p> */}
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <label className="input validator">
                  <Mail />
                  <input
                    type="email"
                    placeholder="mail@site.com"
                    required
                    value={state.email}
                    onChange={(e) =>
                      dispatch({ type: "SET_EMAIL", payload: e.target.value })
                    }
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
                    value={state.password}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_PASSWORD",
                        payload: e.target.value,
                      })
                    }
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
                  <Link className="link link-primary link-hover">Forgot password?</Link>
                </div>
                <div>
                  <p>
                    Do Not Have An Account?
                    <Link
                      to="/register"
                      className="link link-primary link-hover"
                    >
                      Register
                    </Link>
                  </p>
                </div>
                <button className="btn btn-neutral mt-4" onClick={loginUser}>
                  Login
                </button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {state.loading && <p>Loading...</p>}
      {state.error && <p>{state.error}</p>}
      {state.loggedIn && <p>Login success</p>}
    </>
  );
}

export default Login;
