/* eslint-disable no-unused-vars */
import { useState } from "react";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import Spinner from "../assets/components/Spinner";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState({
    emailError: true,
  });
  const [loading, setLoading] = useState(false);
 

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError({
        emailError: true,
    });
    const emailRegex =
      /^(?=.*@(?:gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|example\.com|otherdomain\.com)$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (!emailRegex.test(email)) {
        setError((prevState) => ({
          ...prevState,
          emailError: false,
        }));
        setLoading(false);
        return
      }

    try {
      const auth = getAuth();
      const userCredential = await sendPasswordResetEmail(auth, email);

      const user = userCredential.user;
      
    } catch (error) {
        console.log(error);
   
    }
    setLoading(false)
  };
  const { email } = formData;
if(loading){
  return  <Spinner/>
}

  return (
    <main className="bg-black/90 h-screen">
      <section className="container mx-auto px-4 pt-12 md:px-2 ">
        <h1 className="text-3xl md:text-4xl text-gray-300  font-bold">
          Welcome back!
        </h1>
        <form className="py-8 max-w-4xl " onSubmit={onSubmit}>
          <div>
            <label className="block text-lg font-semibold text-gray-300 py-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Input Email"
                id="email"
                className="w-full py-3 px-6 rounded-md text-xl font-semibold placeholder:text-lg outline-blue-400"
                onChange={onChange}
                value={email}
                required
              />
              <div className="absolute top-1/2 -translate-y-1/2  right-4 ">
                <EmailIcon />
              </div>
            </div>
          </div>

          <div className="w-full text-center py-4 ">
            <button
              type="submit"
              className="py-2 px-10 bg-gradient-to-r from-[#009FC2] to-[#A399B2] rounded-full group group-hover:duration-500 group-hover:transition-all "
            >
              Sign in{" "}
              <span>
                {" "}
                <ChevronRightIcon className=" text-white group-hover:translate-x-2  group-hover:duration-500 group-hover:transition-all " />
              </span>
            </button>
          </div>
        </form>
        <div className="py-8 max-w-4xl">
          <Link
            to="/sign-in"
            className="text-[#00acc1] hover:text-opacity-80 transition-opacity duration-200 "
          >
            Back to sign in <ChevronRightIcon />{" "}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
