import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';

export default function BuyerPage(){
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState('CE22BTECH11050');
  const [itemsList, setItemsList] = useState([
    { itemId: 1, itemName: 'Item 1', quantityAvailable: 10 },
    { itemId: 2, itemName: 'Item 2', quantityAvailable: 5 },
    { itemId: 3, itemName: 'Item 3', quantityAvailable: 8 },
  ]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(()=>{
    // check authentication of the user
    const unsub = auth.onAuthStateChanged((user)=>{
      if(!user) navigate('/login')
    });

    // get the list of the available items
    axios.get('http://localhost:5001/get-items').then((res)=>{
      if(res.status === 200) setItemsList(res.data.list);
      else alert("some unexpected error occurred");
    }).catch((err)=>{
      alert("some unexpected error occurred");
      console.log(err);
    })

    return ()=>{unsub()};
  },[rollNo])

  const logout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const addToCart = (itemId) => {
    const itemToAdd = itemsList.find(item => item.itemId === itemId);
    if (itemToAdd) {
      const existingCartItem = cartItems.find(item => item.itemId === itemId);
      let updatedCart;

      if (existingCartItem) {
        updatedCart = cartItems.map(item =>
          item.itemId === itemId
            ? { ...item, assignedQuantity: item.assignedQuantity + 1 }
            : item
        );
      } else {
        updatedCart = [...cartItems, { itemId: itemToAdd.itemId, itemName: itemToAdd.itemName, assignedQuantity: 1 }];
      }

      setCartItems(updatedCart);

      const index = itemsList.findIndex(item => item.itemId === itemId);
      let updatedItemList = [...itemsList];
      if(updatedItemList[index].quantityAvailable === 1){
        updatedItemList = updatedItemList.filter(item => item.itemId !== itemId);
        setItemsList(updatedItemList);
      } else {
        updatedItemList = itemsList.map(item =>
          item.itemId === itemId ? { ...item, quantityAvailable: item.quantityAvailable - 1 } : item);
        setItemsList(updatedItemList);
      }
    }
  };

  const removeFromCart = (itemId) => {
    const itemToRemove = cartItems.find(item => item.itemId === itemId);
    if (itemToRemove) {
      const updatedCart = cartItems.filter(item => item.itemId !== itemId);
      setCartItems(updatedCart);

      const foundIndex = itemsList.findIndex(item => item.itemId === itemId);
      if(foundIndex !== -1){
        const updatedItemsList = itemsList.map(item =>
          item.itemId === itemId ? { ...item, quantityAvailable: item.quantityAvailable + itemToRemove.assignedQuantity } : item
        );
        setItemsList(updatedItemsList);
      } else {
        const updatedItemList = [...itemsList, {itemId: itemId, itemName: itemToRemove.itemName, quantityAvailable: itemToRemove.assignedQuantity}];
        setItemsList(updatedItemList);
      }
    }
  };

  const decreaseCartItem = (itemId) => {
    const itemToUpdate = cartItems.find(item => item.itemId === itemId);
    if (itemToUpdate) {
      if (itemToUpdate.assignedQuantity > 1) {
        const updatedCart = cartItems.map(item =>
          item.itemId === itemId
            ? { ...item, assignedQuantity: item.assignedQuantity - 1 }
            : item
        );
        setCartItems(updatedCart);

        const foundIndex = itemsList.findIndex(item => item.itemId === itemId);
        if(foundIndex !== -1){
          const updatedItemsList = itemsList.map(item =>
            item.itemId === itemId ? { ...item, quantityAvailable: item.quantityAvailable + 1 } : item
          );
          setItemsList(updatedItemsList);
        } else {
          const updatedItemList = [...itemsList, {itemId: itemId, itemName: itemToUpdate.itemName, quantityAvailable: 1}];
          setItemsList(updatedItemList);
        }
      } else {
        removeFromCart(itemId);
      }
    }
  };

  const handleSubmit = () => {
    if(cartItems.length >= 1){
      console.log('Cart submitted:', cartItems);
      const reqObj = {
        rollNo: rollNo,
        list: cartItems
      }
      axios.put('http://localhost:5001/add-items', reqObj).then((res)=>{
        alert(res.data.message);
      }).catch((err)=>{
        alert("some unexpected error while connecting to backend");
        console.log(err);
      }).finally(()=>{
        setCartItems([]);
      })
    }
  };

  return (
    <div className="buyer-page bg-gray-900 text-white min-h-screen flex flex-col items-center p-5">
      <div className="buyer-details bg-gray-800 rounded-lg p-5 w-full max-w-3xl mb-5 flex justify-between items-center">
        <h2 className="text-xl font-bold">RollNo: {rollNo}</h2>
        <button
          className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="items-list bg-gray-800 rounded-lg p-5 w-full max-w-3xl mb-5">
        <h2 className="text-xl font-bold mb-3">Items List</h2>
        <ul>
          {itemsList.map(item => (
            <li key={item.itemId} className="flex justify-between items-center bg-gray-700 rounded p-3 mb-3">
              <span>{item.itemName}</span>
              <span>ID: {item.itemId}</span>
              <span>Available: {item.quantityAvailable}</span>
              <button
                className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded"
                onClick={() => addToCart(item.itemId)}
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="cart bg-gray-800 rounded-lg p-5 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-3">Cart</h2>
        <ul>
          {cartItems.map(item => (
            <li key={item.itemId} className="flex justify-between items-center bg-gray-700 rounded p-3 mb-3">
              <span>{item.itemName}</span>
              <span>ID: {item.itemId}</span>
              <span>Quantity: {item.assignedQuantity}</span>
              <div className="cart-buttons flex gap-3">
                <button
                  className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded"
                  onClick={() => decreaseCartItem(item.itemId)}
                >
                  -
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded"
                  onClick={() => removeFromCart(item.itemId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="submit-button w-full bg-purple-300 hover:bg-purple-700 text-black py-4 rounded mt-5 text-lg font-bold"
          onClick={handleSubmit}
        >
          Submit Cart
        </button>
      </div>
    </div>
  );
}
