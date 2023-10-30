/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
function ListingItem({ data, id, addToCart }) {
  return (
    <div className="rounded-md">
      <Link
        to={`/category/${data.name}/${id}`}
        className="w-full flex bg-white py-2 px-1 rounded-md hover:scale-[1.01] duration-200 hover:shadow-md md:inline-block group md:w-auto  relative"
      >
        <img
          src={data.imgUrls}
          alt={data.name}
          className="aspect-square w-28 object-cover md:aspect-auto md:w-auto md:object-fill"
        />
        <p className="hidden py-2 font-semibold px-4 md:block">{data.name}</p>

        <div className="hidden items-center justify-between px-4 relative md:flex">
          <p className="font-medium text-black/60">Per portion</p>
          <p className="">
            <span className="font-bold inline-block">&#8358;</span> {data.price}
          </p>
        </div>
        {addToCart && (
          <div className="cart my-4 px-4 hidden md:flex ">
            <button
              disabled={data.quantity === 0 && data.quantity < 0 && true}
              className="p-4 bg-secondary w-full rounded-md relative flex justify-between z-40"
              onClick={(e) => {
                e.preventDefault();
                addToCart(id, data);
                // console.log(e.target)
              }}
            >
              {data.quantity > 0 ? (
                <ShoppingCartIcon className="!text-white" />
              ) : (
                <RemoveShoppingCartIcon className="!text-white " />
              )}
              <p className="flex-1 text-white font-semibold ">ADD TO CART</p>
            </button>
          </div>
        )}
        <div className="w-full">
          <p className="py-2 font-semibold px-4 md:hidden">{data.name}</p>

          <div className="flex items-center justify-between px-4 md:hidden">
            <p className="font-medium text-black/60">Per portion</p>
            <p className="">
              <span className="font-bold inline-block">&#8358;</span>{" "}
              {data.price}
            </p>
          </div>
          {addToCart && (
            <div className="cart my-1 px-4 md:hidden ">
              <button
                data-id={id}
                disabled={data.quantity === 0 && data.quantity < 0 && true}
                className="p-4 bg-secondary w-full rounded-md relative flex justify-between "
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(id, data);
                  // console.log(e.target)
                }}
              >
                {data.quantity > 0 ? (
                  <ShoppingCartIcon className="!text-white" />
                ) : (
                  <RemoveShoppingCartIcon className="!text-white " />
                )}
                <p className="flex-1 text-white font-semibold ">ADD TO CART</p>
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ListingItem;
