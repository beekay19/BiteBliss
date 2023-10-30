/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";

function Modal({
  newData,
  setNewData,
  overlay2,
  modalData,
  setModalData,
  upDateItem,
  data,
  id,
}) {
  const { name, offer, price, quantity, discountedPrice } = newData;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewData((prevState) => ({
      ...prevState,
      ...data,
    }));
  }, []);

  const handleChange = (e) => {
    e.preventDefault();

    let bool = null;

    if (e.target.value === "true") {
      bool = true;
    }
    if (e.target.value === "false") {
      bool = false;
    }

    setNewData((prevState) => ({
      ...prevState,
      [e.target.id]: bool ?? e.target.value,
    }));
  };
  return (
    <div
      className={`h-[calc(100vh-4rem)] w-full fixed top-0_ left-0 bottom-0 bg-black/50 z-20 overlay transition-all duration-500 ${
        modalData ? "" : "active-overlay"
      } `}
      ref={overlay2}
    >
      <button
        className="absolute right-4 top-4 text-white py-2 px-2 bg-black"
        onClick={() => setModalData(true)}
      >
        {" "}
        <CloseIcon />{" "}
      </button>
      <div className="pt-12 max-w-2xl mx-auto">
        <form
          className="bg-white w-full pb-6 pt-4 px-4 rounded-xl shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            upDateItem(id, data);
          }}
        >
          <div className="pb-2">
            <label
              htmlFor="name"
              className="pb-2 block font-bold text-black/70 text-lg  md:text-xl"
            >
              name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              className="w-full border border-slate-300 rounded p-2 focus:ring-1 
                outline-1 outline-primary focus:border-primary focus:ring-opacity-50 focus:ring-primary/50"
              onChange={handleChange}
              required
            />
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
  );
}

export default Modal;
