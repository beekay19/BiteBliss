/* eslint-disable react/prop-types */
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
// import { Close } from "@mui/icons-material";
import Modal from "./Modal";
const tableHeading = [
  "Product",
  "Price",
  "Quantity",
  "Availability",
  "Edit",
  "Product img",
  "delete",
];
function ItemListings({
  heading,
  data,
  editItem,
  id,
  handleDelete,
  setModalData,
  modalData,
  setNewData,
  newData,
  upDateItem,
}) {
  return (
    <>
      <table className="w-full border-collapse my-4">
        <caption> {heading} </caption>
        <thead>
          <tr className="border border-gray-400_">
            {tableHeading.map((item, index) => (
              <th key={index}> {item} </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border border-gray-400_ bg-white">
            <td className="text-ellipsis overflow-hidden" data-cell="name">
              {data.name}
            </td>
            <td className="text-ellipsis overflow-hidden" data-cell="price">
              {data.price}
            </td>
            <td data-cell="quantity">{data.quantity} </td>
            <td data-cell="availability">
              {data.quantity > 0 ? (
                <CheckIcon className="!text-green-600 font-bold" />
              ) : (
                <ClearIcon className="!text-red-600 font-bold " />
              )}{" "}
            </td>
            <td data-cell="edit product">
              <button onClick={() => editItem(id, data)} className="">
                <EditIcon className="!text-green-600 font-bold hover:!text-green-600/50 " />
              </button>
            </td>
            <td data-cell="product image" title="product image">
              {" "}
              <img
                src={data.imgUrls}
                alt={data.name}
                className="w-12 aspect-square rounded-full object-cover"
              />{" "}
            </td>
            <td data-cell="delete" className="" title="delete product">
              <button type="button" onClick={() => handleDelete(id)}>
                <CloseIcon className="!text-red-600 text-center ml-4_" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {/* update listings */}
      <Modal
        setModalData={setModalData}
        modalData={modalData}
        setNewData={setNewData}
        newData={newData}
        data={data}
        id={id}
        upDateItem={upDateItem}
      />
    </>
  );
}

export default ItemListings;
