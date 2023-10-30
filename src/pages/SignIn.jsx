/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  
} from "firebase/auth";
import { Link } from "react-router-dom";
import Spinner from "../assets/components/Spinner";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()
  const [loading , setLoading] = useState(false)
  const [visible, setVisible] = useState(true)

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      if(userCredential.user){
        navigate('/')
       }
     setLoading(false)
     
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const { email, password } = formData;
  if(loading){
    <Spinner/>
  }
  return (
    <main className="bg-input h-screen">
      <section className="max-w-4xl md:max-w-2xl md:mx-auto mx-auto px-4 pt-12 md:px-2 ">
        <h1 className="text-3xl md:text-4xl text-black  font-bold">
          Welcome back!
        </h1>
        <form className="py-8 max-w-4xl " onSubmit={onSubmit}>
        
    
          <div >
            <label className="block text-lg font-semibold text-black py-2">
              Email
            </label>
           <div className="relative">
           <input
              type="email"
              placeholder="Input Email"
              id="email"
              className="w-full py-3 px-6 rounded-md text-xl font-semibold placeholder:text-lg outline-blue-400 bg-white"
              onChange={onChange}
              value={email}
              required
            />
            <div className="absolute top-1/2 -translate-y-1/2  right-4 ">
               <EmailIcon/> 
            </div>
           </div>
          </div>
          <div className=" relative">
            <label className="block text-xl font-semibold text-black py-2">
              Password
            </label>
            <div className="relative">
            <input
              type={`${visible ? 'password' : 'text'}`}
              placeholder="Input Password"
              id="password"
              className="w-full py-3 px-6 rounded-md text-xl font-semibold placeholder:text-lg outline-blue-400 bg-white"
              onChange={onChange}
              value={password}
              required
            />
            <div className="absolute top-1/2 -translate-y-1/2  right-4 " onClick={() => setVisible((prevState) => !prevState)}>
            {visible? <VisibilityOffIcon/> :<VisibilityIcon />}
            </div>
            </div>
          </div>
          <div className="w-full text-center py-4 ">
            <button type="submit" className="py-2 px-10 bg-secondary text-white font-semibold rounded-full group group-hover:duration-500 group-hover:transition-all ">
              Sign in <span > <ChevronRightIcon className=" text-white group-hover:translate-x-2  group-hover:duration-500 group-hover:transition-all " />
                </span>
            </button>
          </div>
        </form>
        <div className="max-w-4xl space-y-4">
           <div>
           <Link to='/forgot-password' className="text-black text-lg font-bold  hover:text-opacity-80 transition-opacity duration-200 ">Forgot your password <ChevronRightIcon /> </Link>
           </div>
            <Link to='/sign-up' className="text-black text-lg font-bold  hover:text-opacity-80 transition-opacity duration-200 ">Sign up for a new accout <ChevronRightIcon/> </Link>
        </div>
      </section>
    </main>
  );
}

export default SignIn;
