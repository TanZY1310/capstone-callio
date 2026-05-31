import { useState, useReducer, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { KeyRound, Mail } from "lucide-react";
import sampleUserList from "../../data/SampleUserList";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
  loading: false,
  loggedIn: false,
};

const ACTIONS = {
  SET_EMAIL: "SET_EMAIL",
  SET_PASSWORD: "SET_PASSWORD",
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
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
        error: "",
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

function LoginForm({ setUser }) {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navigate = useNavigate();
  const { state: registerState } = useLocation();
  const registerUserList = registerState?.updatedUserList;
  const registeredEmail = registerState?.registeredEmail;

  console.log("Check Register From Login: " + registerState);

  useEffect(() => {
    if (registeredEmail) {
      dispatch({ type: ACTIONS.SET_EMAIL, payload: registeredEmail });
    }
  }, [registeredEmail]);

  async function sampleLoginAPI(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Temp implement this to combine registerList and userList later when include db change this
    const combinedUserList = registerUserList ? [...sampleUserList, ...registerUserList] : sampleUserList;

    console.log("Login User List", combinedUserList);
    const user = combinedUserList.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) throw new Error("Invalid email or password");
    localStorage.setItem("currentUser", JSON.stringify(user));

    return { token: "sample-token", user };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      //Handle authentication via backend API, Simulate API for now
      //UserList.js will simulate users from db
      const data = await sampleLoginAPI(state.email, state.password);
      setUser(data.user);
      console.log("Token: ", data.token);
      dispatch({ type: "LOGIN_SUCCESS" });
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR", payload: err.message });
      toast.error(err.message);
    }
  };

  return (
    <>
      <div
        className="hero bg-base-200 min-h-screen relative"
        style={{
          backgroundImage: "url('/building-bg.jpg')",
        }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            {/* <h1 className="text-5xl font-bold">Login Page</h1>
            <p className="py-6">
              Enter a description here for login later
            </p> */}
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
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
                        dispatch({
                          type: "SET_EMAIL",
                          payload: e.target.value,
                        })
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
                    <Link className="link link-primary link-hover">
                      Forgot password?
                    </Link>
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
                  {state.loading ? (
                    <button className="btn btn-neutral mt-4" disabled>
                      <span className="loading loading-spinner loading-sm"></span>
                      Logging in...
                    </button>
                  ) : (
                    <button className="btn btn-neutral mt-4" type="submit">
                      Login
                    </button>
                  )}
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
