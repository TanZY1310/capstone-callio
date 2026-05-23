import { useState, useEffect, useReducer } from "react";
import { Link } from "react-router-dom";

import { KeyRound, Mail, ALargeSmall, UserKey } from "lucide-react";

function Register() {
  const initialState = {
    username: "",
    email: "",
    password: "",
    role: "",
    loading: false,
    loggedIn: false,
  };

  const registerUser = () => {};

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
              <fieldset className="fieldset">
                <label className="label">Username</label>
                <label className="input validator">
                  <ALargeSmall />
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    // value={state.email}
                    // onChange={(e) =>
                    //   dispatch({ type: "SET_EMAIL", payload: e.target.value })
                    // }
                  />
                </label>
                <label className="label">Role</label>
                <label className="label">
                  <UserKey />
                  <select defaultValue="Pick a role" className="select">
                    <option disabled={true}>Pick a role</option>
                    <option>Team Lead</option>
                    <option>Agent</option>
                  </select>
                </label>
                <label className="label">Email</label>
                <label className="input validator">
                  <Mail />
                  <input
                    type="email"
                    placeholder="mail@site.com"
                    required
                    // value={state.email}
                    // onChange={(e) =>
                    //   dispatch({ type: "SET_EMAIL", payload: e.target.value })
                    // }
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
                    // value={state.password}
                    // onChange={(e) =>
                    //   dispatch({
                    //     type: "SET_PASSWORD",
                    //     payload: e.target.value,
                    //   })
                    // }
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
                    <Link to="/login" className="link link-primary link-hover">
                      Sign In
                    </Link>
                  </p>
                </div>
                <button className="btn btn-neutral mt-4">Login</button>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
