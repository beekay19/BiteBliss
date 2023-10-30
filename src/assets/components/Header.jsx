/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, Link, useNavigate } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import { useAuthStatus } from "../../hooks/UseAuthStatus";

function Header() {
  const [active, setActive] = useState(true);
  const [enableHamburger, setEnableHamburger] = useState(false);
  const toggle = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const { loggedIn, checkingStatus } = useAuthStatus();

  // close navbar when route changes
  useEffect(() => {
    setActive(false);
    setEnableHamburger(false);
  }, [location.pathname]);

  const items = [
    {
      category: "Fresh Food",
      link: "/category/Fresh-food",
    },
    {
      category: "Fast Food",
      link: "/category/Fast-food",
    },
    {
      category: "Beverages",
      link: "/category/Beverages",
    },
    {
      category: "Africa dish",
      link: "/category/African-dish",
    },
  ];

  const handleClick = () => {
    setActive(!active);
    const item = toggle.current;
    item.style.height = active ? item.scrollHeight + "px" : 0;
  };

  return (
    <header className="pt-1 z-50 relative bg-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-7xl_ px-4 lg:px-6">
        <div className="flex py-4 justify-center w-full  md:w-auto md:justify-start ">
          <h1 className="font-bold text-2xl ">
            <Link to="/">BiteBliss</Link>{" "}
          </h1>
          <span>
            <FastfoodIcon />
          </span>
        </div>
        <nav
          className={`hamburger ${
            enableHamburger ? "active-hamburger" : ""
          } absolute  top-full w-full left-0 transition-all duration-500  h-full md:relative md:w-auto `}
        >
          <ul className="block  md:flex shadow-lg md:shadow-none ">
            <li className=" drowndown__parent group font-semibold  hover:text-gray-700 md:hover:bg-gray-200 relative cursor-pointer py-4 px-6 bg-white ">
              <div
                onClick={handleClick}
                className="flex justify-between pointer-events-auto md:pointer-events-none"
              >
                Category{" "}
                <ArrowDown className="arrow transition-all rotate-0 group-hover:duration-500 text-right " />
              </div>
              <div
                ref={toggle}
                className={`dropdown__container  relative z-20 bg-white  duration-300 w-full left-0  text-center h-0 overflow-hidden ${
                  active && "active__dropdown"
                } md:h-fit md:overflow-visible md:absolute `}
              >
                <ul className="dropdown__content flex flex-col  gap-1 shadow-2xl">
                  {items.map((item, index) => (
                    <li key={index} className="">
                      <Link
                        className="dropdown__child py-4 bg-white cursor-pointer block  text-black font-semibold hover:bg-black/10"
                        to={item.link}
                      >
                        {item.category}{" "}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="drowndown__parent group font-semibold  hover:text-gray-700 hover:bg-gray-200 relative cursor-pointer  py-4 px-6 bg-white">
              <Link to="/service">Service</Link>
            </li>
            <li className="drowndown__parent group font-semibold  hover:text-gray-700 hover:bg-gray-200 relative cursor-pointer  py-4 px-6 bg-white">
              <Link to="/offers">Offers</Link>
            </li>
          </ul>
        </nav>
        <nav className="hidden md:block">
          <ul className="flex items-center ">
            <li className="py-4">
              <span className="inline-block ">
                <Link to="/sign-in" className="font-semibold">
                  Sign In
                </Link>
              </span>{" "}
              <span>/ {""}</span>
              <span className="inline-block">
                <Link
                  to="/sign-UP "
                  className="py-2 px-4 rounded-full text-white font-semibold bg-secondary "
                >
                  Sign Up
                </Link>
              </span>
            </li>
            {/* : (
            <div
              className="py-1 px-4 bg-secondary rounded-md cursor-pointer hover:bg-secondary/80 transition-all duration-200"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCartIcon className="text-white" />
            </div>
          ) */}
          </ul>
        </nav>
        <div
          className="absolute right-0 block md:hidden"
          onClick={() => setEnableHamburger((prevState) => !prevState)}
        >
          <Button color="inherit">
            <MenuIcon className="text-black" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
