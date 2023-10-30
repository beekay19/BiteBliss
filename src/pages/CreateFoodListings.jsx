/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import img1 from "../assets//icons-images/different-Nigerian-dishes.webp";
import img2 from "../assets/icons-images/Nigerian-soft-drinks-manufacturers-say-FG-proposed-could-cripple-industry.jpg";
import img3 from "../assets/icons-images/istockphoto-180258510-1024x1024.jpg";
import {
  setDoc,
  serverTimestamp,
  doc,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../assets/components/Spinner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

function CreateFoodListings() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const imgList = [img1, img2, img3];

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    quantity: 0,
    offer: false,
    discountedPrice: 0,
  });

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        formData.userRef = auth.currentUser.uid;
      } else {
        navigate("/sign-in");
      }
    });
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => {
        if (prevIndex === imgList.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    let bool = null;
    if (e.target.value === "true") {
      bool = true;
    }
    if (e.target.value === "false") {
      bool = false;
    }

    if (e.target.files) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.files,
      });
    }
    if (!e.target.files) {
      setFormData({
        ...formData,
        [e.target.id]: bool ?? e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (image.length === 0 || image > 4) {
      toast.error("images cannot be more than 4 or less than 1");
      setLoading(false);
      return;
    }

    if (discountedPrice && discountedPrice >= offer) {
      toast.error("Discounted price cannot be more than price");
      setLoading(false);
      return;
    }

    const StoreImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();

        // name the image being uploaded
        const fileName = `{${uuidv4()}-${image.name}-${uuidv4()} }`;
        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

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
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...image].map((img) => StoreImage(img))
    ).catch(() => {
      setLoading(false);
      return;
    });
    const formDataCopy = { ...formData };
    formDataCopy.offer === false && delete formDataCopy.discountedPrice;
    delete formDataCopy.image;

    formDataCopy.imgUrls = imgUrls;
    formDataCopy.createdAt = serverTimestamp();
    console.log(formDataCopy);
    const listingRef = collection(db, "listings");

    await addDoc(listingRef, formDataCopy);

    setLoading(false);
    navigate(`/category/${category}`);
  };
  const {
    name,
    price,
    category,
    description,
    image,
    quantity,
    offer,
    discountedPrice,
  } = formData;

  return (
    <main className="bg-secondary px-4  relative h-[calc(100vh-4.25rem)]">
      <div className=" mx-auto_ bg-input py-12_ px-4_ md:flex h-full ">
        <div className="max-w-xl_ mx-auto z-20 py-12 bg-input w-full h-full overflow-auto px-4 flex-1">
          <h1 className="font-bold text-xl md:text-2xl lg:text-4xl">
            Create New Food Listing
          </h1>
          <form className=" py-4" onSubmit={handleSubmit}>
            <div className="pb-4">
              <label
                htmlFor="name"
                className="font-bold text-black/70 text-lg md:text-xl block pb-2"
              >
                Name
              </label>
              <input
                type="text"
                className="w-full py-2 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Name"
                id="name"
                required
                onChange={handleChange}
                value={name}
              />
            </div>
            <div className="pb-4">
              <label className="font-bold text-black/70 text-lg md:text-xl block pb-2">
                Category
              </label>

              <div className="grid gap-4 grid-cols-2 ">
                <div className="flex items-center gap-4">
                  <div className="relative flex_ justify-center items-center">
                    <input
                      type="radio"
                      name="food"
                      id="category"
                      value={"Fresh-food"}
                      onClick={handleChange}
                      className="input-radio absolute top-0_ opacity-0"
                    />
                    <label
                      htmlFor="fresh food"
                      className="input-btn w-4 h-4 block rounded-full bg-white outline outline-2 outline-secondary  outline-offset-2"
                    ></label>
                  </div>
                  <p className="font-semibold">Fresh Food</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex_ justify-center items-center">
                    <input
                      type="radio"
                      name="food"
                      id="category"
                      value={"Fast-food"}
                      onClick={handleChange}
                      className="input-radio absolute top-0_ opacity-0"
                    />
                    <label
                      htmlFor="fast food"
                      className="input-btn w-4 h-4 block rounded-full bg-white outline outline-2 outline-secondary  outline-offset-2"
                    ></label>
                  </div>
                  <p className="font-semibold">Fast Food</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex_ justify-center items-center">
                    <input
                      type="radio"
                      name="food"
                      id="category"
                      onClick={handleChange}
                      value={"Beverages"}
                      className="input-radio absolute top-0_ opacity-0"
                    />
                    <label
                      htmlFor="beverages"
                      className="input-btn w-4 h-4 block rounded-full bg-white outline outline-2 outline-secondary  outline-offset-2"
                    ></label>
                  </div>
                  <p className="font-semibold">Beverages</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex_ justify-center items-center">
                    <input
                      type="radio"
                      name="food"
                      id="category"
                      onClick={handleChange}
                      value={"African-dish"}
                      className="input-radio absolute top-0_ opacity-0"
                    />
                    <label
                      htmlFor="african dish"
                      className="input-btn w-4 h-4 block rounded-full bg-white outline outline-2 outline-secondary  outline-offset-2"
                    ></label>
                  </div>
                  <p className="font-semibold">African dish</p>
                </div>
              </div>
            </div>
            <div className="pb-4">
              <label
                htmlFor=""
                className="font-bold text-black/70 text-lg block pb-2 md:text-xl"
              >
                Offer
              </label>
              <div className="flex item-centet gap-4">
                <button
                  className={`py-2 px-8 focus:outline-none border border-slate-300 rounded-xl text-white font-semibold block ${
                    offer ? "bg-secondary" : "bg-white !text-black"
                  }`}
                  type="button"
                  id="offer"
                  onClick={handleChange}
                  value={true}
                >
                  True
                </button>
                <button
                  className={`py-2 px-8 focus:outline-none border text-black border-slate-300 rounded-xl  font-semibold block ${
                    !offer ? "bg-secondary text-white" : "bg-white text-black"
                  }`}
                  type="button"
                  id="offer"
                  onClick={handleChange}
                  value={false}
                >
                  False
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="pb-4">
                <label
                  htmlFor="price"
                  className="font-bold text-black/70 text-lg
                block pb-2 md:text-xl "
                >
                  Price{" "}
                </label>
                <input
                  type="number"
                  id="price"
                  className="py-2 px-4 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl w-full"
                  value={price}
                  onChange={handleChange}
                  required
                  min="50"
                  max="100000"
                />
              </div>
              <AnimatePresence>
                {offer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="pb-4">
                      <label
                        htmlFor="price"
                        className="font-bold text-black/70 text-lg
                block pb-2 md:text-xl "
                      >
                        Discounted Price{" "}
                      </label>
                      <input
                        type="number"
                        id="discountedPrice"
                        className="py-2 px-4 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl w-full "
                        value={discountedPrice}
                        onChange={handleChange}
                        required
                        min="50"
                        max="100000"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="pb-4">
              <label
                htmlFor="quantity"
                className="font-bold text-black/70 text-lg
                block pb-2 md:text-xl "
              >
                Available quantity{" "}
              </label>
              <input
                type="number"
                id="quantity"
                className="py-2 px-4 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl "
                value={quantity}
                onChange={handleChange}
                required
                min="1"
                max="100000"
              />
            </div>
            <div className="pb-4 relative">
              <label
                htmlFor="description"
                className="pb-2 font-bold text-black/70 block text-lg md:text-xl"
              >
                Discription
              </label>
              <textarea
                name=""
                id="description"
                value={description}
                onChange={handleChange}
                placeholder="Enter message description"
                className="w-full h-40 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl px-4 py-2 "
                required
              ></textarea>
              <p
                className={`absolute right-5 bottom-5 ${
                  description.length > 150 && "text-red-700"
                }`}
              >
                {description.length > 150 && <span>-</span>}
                {description.length}/<span>150</span>
              </p>
            </div>
            <div className="pb-4">
              <label className="block font-bold text-black/70 text-lg md:text-xl pb-2">
                Upload Images
              </label>
              <input
                type="file"
                name="images"
                id="image"
                className="py-3 block w-full bg-white rounded-lg file:bg-[#f69437] file:border-none file:text-white file:py-1 file:px-4 file:rounded-xl file:mx-4 font-semibold"
                onChange={handleChange}
                max="3"
                required
                accept=".jpg,.png,.jpeg"
                multiple
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="py-2 px-4 bg-secondary text-white text-center rounded-xl font-semibold"
              >
                Submit Listing
              </button>
            </div>
          </form>
        </div>
        <div
          className="hidden create-listing h-full relative md:block bg-white flex-1 px-4 select-none"
          style={{
            backgroundImage: `url(${imgList[activeIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center h-full w-full transition-all duration-500 overflow-hidden">
            {imgList.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                loading="lazy"
                className="w-full h-full shrink-0"
                draggable="false"
                style={{ transform: `translatex(${-activeIndex * 100}%)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CreateFoodListings;
