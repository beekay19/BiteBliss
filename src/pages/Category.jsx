/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import {
  collection,
  where,
  query,
  limit,
  getDocs,
  orderBy,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import _ from "lodash";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ListingItem from "../assets/components/ListingItem";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../assets/components/Spinner";
import DataContext from "../contextProvider/DataContext";

function Category() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/sign-in");
      }
    });
  });

  const auth = getAuth();
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("category", "==", params.categoryName),
          limit(2)
        );
        const querySnap = await getDocs(q);
        const listing = [];

        querySnap.forEach((item) => {
          return listing.push({
            data: item.data(),
            id: item.id,
          });
        });
        setListings(listing);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, [params.categoryName]);
  let newItem1;

  const addToCart = async (id, data) => {
    const newListing = listings.map((item) => {
      if (item.id === id) {
        newItem1 = { ...item.data, quantity: item.data.quantity - 1 };
        return {
          ...item,
          data: { ...item.data, quantity: item.data.quantity - 1 },
        };
      }
      return item;
    });

    let newListingcopy = _.cloneDeep(newItem1);
    delete newListingcopy.quantity;
    delete newListingcopy.userRef;
    const quantity = 1;

    newListingcopy = {
      ...newListingcopy,
      quantity,
      userRef: auth.currentUser.uid,
      email: auth.currentUser.email,
    };

    // update listings in firestore
    // const docRef = doc(db,'listings',auth)
    await updateDoc(doc(db, "listings", id), { quantity: newItem1.quantity });

    // create new listings in firestore

    const docRef = doc(db, "cart", id);
    const docSnap = await getDoc(docRef);
    const cartData = docSnap.data();
    // if the current item is in the cart, update the quantity
    if (docSnap.exists()) {
      await updateDoc(doc(db, "cart", id), { quantity: cartData.quantity + 1 });
      navigate("/cart");
    } else {
      // create new item in cart

      const docRef1 = doc(db, "cart", id);
      await setDoc(docRef1, newListingcopy);
      navigate("/cart");
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="bg-secondary px-4">
      <div className="container mx-auto bg-input pt-12 min-h-[calc(100vh-4.3rem)]">
        <div className=" px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {listings.map(({ data, id }) => (
            <ListingItem key={id} data={data} id={id} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Category;
