/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
import {
  doc,
  onSnapshot,
  updateDoc,
  collection,
  getDocs,
  where,
  limit,
  query,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import Menu from "@mui/icons-material/Menu";
import ShopIcon from "@mui/icons-material/Shop";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AppsIcon from "@mui/icons-material/Apps";
import StoreIcon from "@mui/icons-material/Store";
import { useNavigate } from "react-router-dom";
import Person2Icon from "@mui/icons-material/Person2";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "../assets/components/Spinner";
import { toast } from "react-toastify";
import ItemListings from "../assets/components/ItemListings";
function Dashboard() {
  const [active, setActive] = useState(false);

  // for activating loading state
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(true);
  const [modalData, setModalData] = useState(true);

  const [listings, setListings] = useState([]);

  // listing for updating address
  const [userData, setUserData] = useState({
    address: "",
    country: "",
    phone: "",
    state: "",
    zip: "",
  });
  // listing for updating data
  const [newData, setNewData] = useState({
    name: "",
    quantity: 0,
    price: 0,
    offer: false,
    discountedPrice: 0,
  });
  // initialize firebase auth
  const auth = getAuth();

  // getting address overlay
  const overlay = useRef();
  const overlay2 = useRef();

  const navigate = useNavigate();
  //  check if user is signed in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("sign-in");
      }
    });
    const fetchUser = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      onSnapshot(docRef, (doc) => {
        setUserData((prevState) => ({
          ...prevState,
          ...doc.data(),
        }));
      });
    };
    fetchUser();
  }, [userData, auth.currentUser.uid]);

  // useEffect for fetching all listings for users
  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        limit(10)
      );
      // const querySnap = await getDocs(q);
      onSnapshot(q, (doc) => {
        let listing = [];
        doc.docs.forEach((item) => {
          listing.push({
            data: item.data(),
            id: item.id,
          });
        });
        setListings(listing);
      });

      // querySnap.forEach((item) => {
      //   return listing.push({
      //     data: item.data(),
      //     id: item.id,
      //   });
      // });
      // setListings(listing);
    };
    fetchListings();
  }, []);

  // updating address form data
  const onMutate = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // updating listings form data
  const submitAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { ...userData });
    } catch (error) {
      toast.error("an error occured");
    }

    setTimeout(() => {
      setModal(true);
    }, 1);
    setLoading(false);
  };

  // edit listings
  const editItem = () => {
    setModalData(false);
  };

  const upDateItem = async (id, data) => {
    setLoading(true);
    // e.preventDefault();

    if (newData.name === "") {
      toast.error("Name field cannot be empty");
      setLoading(false);
      return;
    }
    if (newData.discountedPrice > newData.price) {
      toast.error("Discounted price cannot be greater than price");
      setLoading(false);
      return;
    }

    newData.offer === false && delete newData.discountedPrice;

    try {
      const docRef = doc(db, "listings", id);
      await updateDoc(docRef, { ...newData });
      setLoading(false);
    } catch (error) {
      toast.error("an error occured");
      setLoading(false);
    }
  };

  // delete listings
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      if (window.confirm("You are about to delete this listing")) {
        const docRef = doc(db, "listings", id);
        await deleteDoc(docRef);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("aborted item deletion");
      }
    } catch (error) {
      toast.error("an error occured");
      setLoading(false);
    }
  };
  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="bg-secondary relative h-full w-full ">
      <nav
        className={`fixed pl-2 pt-20 left-0 bottom-0 h-full z-10  bg-secondary ${
          active ? "w-32 md:w-64" : "w-14 md:w-20"
        } transition-all duration-500 md:pl-4`}
      >
        <button
          className="text-black hover:bg-white  text-start  rounded-full p-2 md:py-3 md:px-3 "
          onClick={() => setActive((prevState) => !prevState)}
        >
          <Menu className="!text-3xl" />
        </button>
        <nav className="navbar py-4 px-2 md:px-3 flex items-start flex-col gap-y-8">
          <button className="group relative transition-all duration-200">
            <Person2Icon className="!text-3xl text-white" />
            <span className=" opacity-0 group-hover:opacity-100  font-bold text-lg right-0 absolute transition-all bg-input py-1 px-2 rounded shadow-lg duration-1000 group-hover:-right-[6rem] whitespace-nowrap">
              {" "}
              Profile
            </span>
          </button>
          <button className="group relative transition-all duration-200">
            <AppsIcon className="!text-3xl text-white" />
            <span className=" opacity-0 group-hover:opacity-100  font-bold text-lg right-0 absolute transition-all bg-input py-1 px-2 rounded shadow-lg duration-1000 group-hover:-right-[7rem] whitespace-nowrap">
              {" "}
              Products
            </span>
          </button>
          <button className="group relative transition-all duration-200">
            <ShopIcon className="!text-3xl text-white" />
            <span className=" opacity-0 group-hover:opacity-100  font-bold text-lg right-0 absolute transition-all bg-input py-1 px-2 rounded shadow-lg duration-1000 group-hover:-right-[7.8rem] whitespace-nowrap">
              {" "}
              purchased
            </span>
          </button>
          <button className="group relative transition-all duration-200">
            <StoreIcon className="!text-3xl text-white" />
            <span className="opacity-0 group-hover:opacity-100  font-bold text-lg right-0 absolute transition-all bg-input py-1 px-2 rounded shadow-lg duration-1000 group-hover:-right-[7.2rem] whitespace-nowrap">
              {" "}
              Available
            </span>
          </button>
          <button className="group relative transition-all duration-200 rounded-full  hover:scale-110">
            <RemoveShoppingCartIcon className="!text-3xl text-white" />
            <span className=" opacity-0 group-hover:opacity-100  font-bold text-lg right-0 absolute transition-all bg-input py-1 px-2 rounded shadow-lg duration-1000 group-hover:-right-[8.8rem] whitespace-nowrap">
              {" "}
              Out of Stock
            </span>
          </button>
        </nav>
      </nav>
      <div
        className={`duration-500 transition-all absolute bg-input pb-12 ${
          active
            ? "w-[calc(100% - 16rem)] left-32 md:left-64"
            : "w-[calc(100% - 4rem)] left-12 md:left-20"
        } right-0`}
      >
        <div className=" max-w-5xl mx-auto ">
          <h2 className="text-4xl font-bold text-black px-6 pt-12 pb-5">
            Profile
          </h2>
          <div className="min-h-[24rem] shadow-lg_ px-6">
            <section className="grid grid-cols-1  gap-4 md:grid-cols-2">
              <div className="border border-slate-300">
                <div className="border-b-slate-300 border-b-2">
                  <h3 className="font-semibold text-black py-2 px-4">
                    Account Details
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-black font-medium">
                    Name: <span>{auth.currentUser.displayName}</span>
                  </p>
                  <p className="text-black font-medium">
                    Email: <span>{auth.currentUser.email}</span>
                  </p>
                  <p className="text-black font-medium">
                    Status: <span>Seller</span>
                  </p>
                </div>
              </div>
              <div className="border border-slate-300  h-full">
                <div className="border-b-slate-300 border-b-2">
                  <h3 className="font-semibold text-black py-2 px-4">
                    Address Details
                  </h3>
                </div>
                {userData.address === "" ? (
                  <div className="grid place-content-center h-[calc(100%-25.5%)] ">
                    <button
                      className="py-2 px-4 rounded bg-secondary text-white"
                      onClick={() => setModal(false)}
                    >
                      Add address
                    </button>
                  </div>
                ) : (
                  <div className="p-4 space-y-1">
                    <p className="text-black font-medium">
                      Address: <span>{userData.address}</span>
                    </p>
                    <p className="text-black font-medium">
                      Phone number: <span>{userData.phone}</span>
                    </p>
                    <p className="text-black font-medium">
                      country : <span>{userData.country}</span>
                    </p>
                    <p className="text-black font-medium">
                      State : <span>{userData.state}</span>
                    </p>
                    <p className="text-black font-medium">
                      Zip code : <span>{userData.zip}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="border border-slate-300 py-4 col-span-full">
                <div className="border-b border-b-slate-300">
                  <h3 className="font-semibold text-black p-2">
                    Items recently purchased
                  </h3>
                </div>
                <div className="p-2">
                  <p>No item purchased yet</p>
                </div>
              </div>
            </section>
            {/* listings */}

            {listings.map(({ data, id }, index) => (
              <ItemListings
                key={index}
                data={data}
                id={id}
                editItem={editItem}
                handleDelete={handleDelete}
                setModalData={setModalData}
                modalData={modalData}
                setNewData={setNewData}
                newData={newData}
                upDateItem={upDateItem}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`h-[calc(100vh-4rem)] w-full fixed top-0_ left-0 bottom-0 bg-black/50 z-20 overlay transition-all duration-500 ${
          modal ? "" : "active-overlay"
        } `}
        ref={overlay}
      >
        <button
          className="absolute right-4 top-4 text-white py-2 px-2 bg-black"
          onClick={() => setModal(true)}
        >
          {" "}
          <CloseIcon />{" "}
        </button>
        <div className="pt-12 max-w-2xl mx-auto">
          <form
            className="bg-white w-full pb-6 pt-4 px-4 rounded-xl shadow-lg"
            onSubmit={submitAddress}
          >
            <div className="pb-2">
              <label htmlFor="address" className="pb-2 block">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={userData.address}
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 
                outline-1 outline-primary focus:border-primary focus:ring-opacity-50 focus:ring-primary/50"
                onChange={onMutate}
                required
              />
            </div>
            <div className="pt-2">
              <label htmlFor="state" className="pb-2 block">
                State
              </label>
              <input
                type="text"
                id="state"
                value={userData.state}
                onChange={onMutate}
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 
                outline-1 outline-primary focus:border-primary focus:ring-opacity-50 focus:ring-primary/50"
              />
            </div>
            <div className="pt-2">
              <label htmlFor="country" className="pb-2 block">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={userData.country}
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 
                outline-1 outline-primary focus:border-primary focus:ring-opacity-50 focus:ring-primary/50"
                onChange={onMutate}
                required
              />
            </div>
            <div className="pt-2">
              <label htmlFor="number" className="pb-2 block">
                Phone Number
              </label>
              <input
                type="number"
                id="phone"
                value={userData.phone}
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 
                outline-1 outline-primary focus:border-primary focus:ring-opacity-50 focus:ring-primary/50"
                onChange={onMutate}
                required
              />
            </div>
            <div className="pt-2">
              <label htmlFor="zip" className="pb-2 block">
                Zip Code
              </label>
              <input
                type="number"
                id="zip"
                value={userData.zip}
                className="w-full border border-slate-300 rounded p-2 focus:ring-1 
                outline-1 outline-primary focus:border-primary focus:ring-opacity-50 focus:ring-primary/50"
                onChange={onMutate}
              />
            </div>

            <div>
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="text-white bg-secondary py-2 px-4 rounded"
                >
                  Submit Address
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
