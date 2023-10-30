/* eslint-disable no-unused-vars */
import { useState } from "react";
import { db } from "../firebase.config";
import { v4 as uuidv4} from 'uuid'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../assets/components/Spinner";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LockIcon from "@mui/icons-material/Lock";
function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    images: {}
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState({
    passwordError: true,
    emailError: true,
    nameError: true,
   
  });
  const navigate = useNavigate();

  const { passwordError, emailError, nameError } = error;

  const onChange = (e) => {
   if(e.target.files){
    setFormData((prevState) =>({
      ...prevState,
      images: e.target.files
    }))
   }
if(!e.target.files){
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }));
}

  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // display loading animation
    setLoading(true);
    setError({
      passwordError: true,
      emailError: true,
      nameError: true,
    });

    // regular expression to validate form submission
    const emailRegex =
      /^(?=.*@(?:gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|example\.com|otherdomain\.com)$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const nameRegex = /^[A-Za-z ]*$/;
    const passwordRegex = /^(?=\w*\d)[A-Za-z\d]{1,10}$/;
    if (!emailRegex.test(email)) {
      setError((prevState) => ({
        ...prevState,
        emailError: false,
      }));
      setLoading(false);
      
    }
    if (!passwordRegex.test(password)) {
      setError((prevState) => ({
        ...prevState,
        passwordError: false,
      }));
      setLoading(false);
   
    }
    if (!nameRegex.test(name)) {
      setError((prevState) => ({
        ...prevState,
        nameError: false,
      }));
      setLoading(false);
      
    }
    if(!emailRegex.test(email) && !passwordRegex.test(password) && !nameRegex.test(name)){
      return
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const StoreImage = async(image) =>{
        return new Promise((resolve,reject) =>{
          const storage =  getStorage()

          // name the image being uploaded
          const fileName = `{${uuidv4()}-${image.name}-${uuidv4()} }`
          const storageRef = ref(storage,'images/' + fileName);

          const uploadTask = uploadBytesResumable(storageRef, image);

          console.log(fileName)


          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
              }
            },
            (error) => {
              reject(error);
              console.log(error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        })
      }

      const imgUrls =  await Promise.all(
        [...images].map((image) => StoreImage(image))
      ).catch(() =>{
        setLoading(false)
        return 
      })
      console.log(imgUrls)
      
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
        photoURL :imgUrls[0]
      });
      console.log(auth.currentUser)
      const formDataCopy = { ...formData,
      imgUrls };

      delete formDataCopy.password;
      delete formDataCopy.images
      formDataCopy.timestamp = serverTimestamp();
      console.log(formDataCopy);
      setLoading(false);
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const { email, password, username, name,images } = formData;



  //  console.log(error.emailError)
  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="bg-input min-h-screen">
      <section className="mx-auto px-4 pt-12 md:px-2 max-w-4xl md:max-w-2xl md:mx-auto">
      <h1 className="text-3xl md:text-4xl text-black  font-bold ">
          Create new accout
        </h1>
        <form className="pt-8 pb-4 " onSubmit={onSubmit}>
          <div className=" relative">
            <div className="flex items-center justify-between">
              <label className="name block text-xl font-semibold text-black py-2">
                Name
              </label>
             {!nameError && ( <small className="text-rose-800">
                Name can only contain letters{" "}
              </small>)}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Name"
                id="name"
                className="w-full py-3 px-10 rounded-md text-lg font-semibold placeholder:text-lg outline-blue-400 bg-white"
                onChange={onChange}
                value={name}
                required
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <PersonIcon />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="name block text-xl font-semibold text-black py-2">
                Username
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Username"
                id="username"
                className="w-full py-3 px-10 rounded-md text-lg font-semibold placeholder:text-lg outline-blue-400 bg-white"
                onChange={onChange}
                value={username}
                required
              />
              <div className="absolute top-1/2 -translate-y-1/2  left-2 ">
                <PersonAddIcon />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold text-black py-2">
                Email
              </label>
              {!emailError && ( <small className="text-rose-800">
              Invalid email{" "}
              </small>)}
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Input Email"
                id="email"
                className="w-full py-3 px-10 rounded-md text-xl font-semibold placeholder:text-lg outline-blue-400 bg-white"
                onChange={onChange}
                value={email}
                required
              />
              <div className="absolute top-1/2 -translate-y-1/2  left-2 ">
                <EmailIcon />
              </div>
            </div>
          </div>
          <div className=" relative">
            <div className="flex items-center justify-between">
              <label className="block text-lg font-semibold text-black py-2">
                Password
              </label>
              { !passwordError &&
                <small className="text-rose-800">
                  Password must start with capital letter and contain a number
                </small>
              }
            </div>
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2  left-2 ">
                <LockIcon />
              </div>
              <input
                type={`${visible ? "password" : "text"}`}
                placeholder="Input Password"
                id="password"
                className="w-full py-3 px-10 rounded-md text-xl font-semibold placeholder:text-lg outline-blue-400 bg-white"
                onChange={onChange}
                value={password}
                required
              />
              <div
                className="absolute top-1/2 cursor-pointer -translate-y-1/2  right-4 "
                onClick={() => setVisible((prevState) => !prevState)}
              >
                {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
          </div>
          <div className="">
          <label className="block text-lg font-semibold text-black py-2">Profile Image</label>
            <input type="file" name="images" id="images" className="py-3 block w-full bg-white rounded-lg file:bg-[#f69437] file:border-none file:text-white file:py-1 file:px-4 file:rounded-xl file:mx-4 font-semibold" onChange={onChange}
            required
            max='1' 
            accept=".jpg,.png,.jpeg"
            multiple
            />

          </div>
          <div className="w-full text-center pt-4 ">
            <button
              type="submit"
              className="py-2 px-10 bg-secondary text-white font-semibold rounded-full group group-hover:duration-500 group-hover:transition-all "
            >
              Sign Up{" "}
              <span>
                {" "}
                <ChevronRightIcon className=" text-white group-hover:translate-x-2  group-hover:duration-500 group-hover:transition-all " />
              </span>
            </button>
          </div>
        </form>
        <div className="max-w-4xl space-x-4">
          <p className="text-gray-500 ">
            Already have account?{" "}
            <Link
              to="/sign-in"
              className="text-secondary hover:text-opacity-80 transition-opacity duration-200"
            >
              sign in
            </Link>{" "}
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
