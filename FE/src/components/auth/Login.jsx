/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { ApiUrl } from "../../context/Urlapi";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

export function Login() {
  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState(false);
  const [alertSuccess, setAllert] = useState(false);
  const baseUrl = useContext(ApiUrl);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStatus(false);
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // console.log(formLogin, baseUrl);
    if (formLogin) {
      axios
        .post(`${baseUrl}/auth/login`, formLogin)
        .then((res) => {
          // console.log(res.data.data);
          const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("expiresAt", expiresAt);
          localStorage.setItem("userData", JSON.stringify(res.data.data.user));
          setAllert(true);
          setTimeout(() => {
            setAllert(false);
            navigate({ to: "/" });
          }, 1500);
        })
        .catch((res) => {
          console.log(res);
          setStatus(true);
        });
    }
  };

  return (
    <>
      <div className="container-fluid bg-blue-900 min-h-screen grid justify-center items-center ">
        {alertSuccess && (
          <div
            className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-teal-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">LOGIN SUCCESSFULLY !</p>
                <p className="text-sm">Welcome to Candra</p>
              </div>
            </div>
          </div>
        )}
        <div className="login p-2">
          <div className="box-login bg-white/20 backdrop-blur-md  md:w-[32em] shadow-lg shadow-gray-900 rounded-lg md:rounded-l-lg ">
            <div className="form p-12 mb-10">
              {status && (
                <div
                  className="flex items-center p-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <svg
                    className="shrink-0 inline w-4 h-4 me-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Login Failure!</span> Username
                    & Password in correct
                  </div>
                </div>
              )}
              <div className="brand flex justify-center items-center">
                <img
                  src="/RSGM-YARSI/images/logo_candra.png"
                  className="w-12"
                  alt=""
                />
                <span className="text-3xl text-white font-bold mx-5">
                  CANDRA
                </span>
              </div>
              <hr className="mt-4" />
              <div className="formLogin mt-5 ">
                <h1 className="text-xl font-semibold text-gray-200 text-center">
                  Sign In
                </h1>

                <form
                  className="max-w-sm mx-auto mt-5 flex flex-col"
                  onSubmit={handleLogin}
                >
                  <div className="mb-5">
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      onChange={handleChange}
                      id="username"
                      name="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-300 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="text-white group bg-blue-800 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex "
                  >
                    <span className="text-center">Submit</span>
                    <span className="ms-auto me-3 group-hover:me-0 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
