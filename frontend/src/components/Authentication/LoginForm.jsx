import { useState, useReducer, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { KeyRound, Mail, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("Check Register From Login: " + registerState);
    if (registeredEmail) {
      dispatch({ type: ACTIONS.SET_EMAIL, payload: registeredEmail });
    }
  }, [registeredEmail, registerState]);

  async function sampleLoginAPI(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Temp implement this to combine registerList and userList later when include db change this
    const combinedUserList = registerUserList
      ? [...sampleUserList, ...registerUserList]
      : sampleUserList;

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
    dispatch({ type: ACTIONS.LOGIN_START });

    try {
      //TODO Handle authentication via backend API, Simulate API for now
      //UserList.js will simulate users from db
      const data = await sampleLoginAPI(state.email, state.password);
      setUser(data.user);
      console.log("Token: ", data.token);
      dispatch({ type: ACTIONS.LOGIN_SUCCESS });
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 3000);
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
            backgroundImage: "url('/building-bg.jpg')",
            backgroundSize: "cover",
          }}>
          <span className="font-bold text-2xl">CALLIO</span>
          <blockquote className="text-lg opacity-80">
            {/* "Manage your leads and track every conversation." */}
          </blockquote>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center p-8 bg-base-100">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-base-content">
                Welcome back
              </h1>
              <p className="text-sm text-base-content/50 mt-1">
                Sign in to your Callio account
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <label className="input validator w-full">
                  <Mail size={15} className="text-base-content/40" />
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
                <label className="input validator w-full">
                  <KeyRound size={15} className="text-base-content/40" />
                  <input
                    type={showPassword ? "text" : "password"}
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
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-base-content/40 hover:text-base-content">
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
                  <a
                    className="link link-primary link-hover"
                    onClick={() =>
                      document
                        .getElementById("forgot_password_modal")
                        .showModal()
                    }>
                    Forgot password?
                  </a>
                </div>
                <div>
                  <p>
                    Do Not Have An Account?
                    <Link
                      to="/register"
                      className="link link-primary link-hover">
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
                <button className="btn btn-neutral px-4 py-2 rounded">Close</button>
                <button className="btn btn-neutral px-4 py-2 rounded">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default LoginForm;
