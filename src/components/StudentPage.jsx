import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';

export default function StudentPage() {
  const navigate = useNavigate();
  const [rollNo, setRollNo] = useState('CE22BTECH11050');
  const [ownedItems, setOwnedItems] = useState([
    { itemId: 1, itemName: 'Item 1', assignedQuantity: 10 },
    { itemId: 2, itemName: 'Item 2', assignedQuantity: 5 },
    { itemId: 3, itemName: 'Item 3', assignedQuantity: 8 },
  ]);
  const [returnItems, setReturnItems] = useState([]);

  useEffect(() => {
    // Check authentication of the user
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/login');
    });

    axios.get(`http://localhost:5001/${rollNo}/get-items`).then((res) => {
      if (res.status === 200) {
        setOwnedItems(res.data.list);
      } else {
        alert('Some unexpected error occurred');
      }
    }).catch((err) => {
      alert('Some unexpected error occurred');
      console.log(err);
    });

    return () => { unsub(); };
  }, [rollNo, navigate]);

  const logout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const addToReturn = (itemId) => {
    const itemToAdd = ownedItems.find(item => item.itemId === itemId);
    if (itemToAdd && itemToAdd.assignedQuantity > 0) {
      const existingReturnItem = returnItems.find(item => item.itemId === itemId);
      let updatedReturn;

      if (existingReturnItem) {
        updatedReturn = returnItems.map(item =>
          item.itemId === itemId
            ? { ...item, assignedQuantity: item.assignedQuantity + 1 }
            : item
        );
      } else {
        updatedReturn = [...returnItems, { ...itemToAdd, assignedQuantity: 1 }];
      }

      setReturnItems(updatedReturn);

      const updatedOwnedItems = ownedItems.map(item =>
        item.itemId === itemId ? { ...item, assignedQuantity: item.assignedQuantity - 1 } : item
      );
      setOwnedItems(updatedOwnedItems.filter(item => item.assignedQuantity > 0 || item.itemId !== itemId));
    }
  };

  const removeFromReturn = (itemId) => {
    const itemToRemove = returnItems.find(item => item.itemId === itemId);
    if (itemToRemove) {
      const updatedReturn = returnItems.filter(item => item.itemId !== itemId);
      setReturnItems(updatedReturn);

      const index = ownedItems.findIndex(item => item.itemId === itemId);
      if (index !== -1) {
        const updatedOwnedItems = [...ownedItems];
        updatedOwnedItems[index].assignedQuantity += itemToRemove.assignedQuantity;
        setOwnedItems(updatedOwnedItems);
      } else {
        const updatedOwnedItems = [...ownedItems, { itemId: itemId, itemName: itemToRemove.itemName, assignedQuantity: itemToRemove.assignedQuantity }];
        setOwnedItems(updatedOwnedItems);
      }
    }
  };

  const decreaseReturnItem = (itemId) => {
    const itemToUpdate = returnItems.find(item => item.itemId === itemId);
    if (itemToUpdate) {
      if (itemToUpdate.assignedQuantity > 1) {
        const updatedReturn = returnItems.map(item =>
          item.itemId === itemId
            ? { ...item, assignedQuantity: item.assignedQuantity - 1 }
            : item
        );
        setReturnItems(updatedReturn);
        const findOwnedIndex = ownedItems.findIndex(item => item.itemId === itemId);
        if (findOwnedIndex !== -1) {
          const updatedOwnedItems = [...ownedItems];
          updatedOwnedItems[findOwnedIndex].assignedQuantity++;
          setOwnedItems(updatedOwnedItems);
        }
        else {
          const updatedOwnedItems = [...ownedItems, { itemId, itemName: itemToUpdate.itemName, assignedQuantity: 1 }]
          setOwnedItems(updatedOwnedItems);
        }
      } else {
        removeFromReturn(itemId);
      }
    }
  };

  const handleReturnSubmit = () => {
    if (returnItems.length >= 1) {
      console.log('Return cart submitted:', returnItems);
      const reqObj = {
        rollNo: rollNo,
        list: returnItems
      }
      axios.put(`http://localhost:5001/return`, reqObj).then((res) => {
        alert(res.data.message);
      }).catch((err) => {
        alert('Some unexpected error occurred while connecting to the backend');
        console.log(err);
      }).finally(() => {
        setReturnItems([]);
      });
    }
  };

  return (
    <div className="return-page bg-gray-900 text-white min-h-screen flex flex-col items-center p-5">
      <div className="header w-full max-w-3xl flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">RollNo: {rollNo}</h2>
        <button
          className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="take-items-button mb-5">
        <button onClick={() => { navigate('/assign-items'); }} className="bg-purple-300 hover:bg-purple-700 text-black py-2 px-4 rounded">
          Take More Items
        </button>
      </div>

      <div className="owned-items-list bg-gray-800 rounded-lg p-5 w-full max-w-3xl mb-5">
        <h2 className="text-xl font-bold mb-3">Items You Currently Have</h2>
        <ul>
          {ownedItems.map(item => (
            <li key={item.itemId} className="flex justify-between items-center bg-gray-700 rounded p-3 mb-3">
              <span>{item.itemName}</span>
              <span>ID: {item.itemId}</span>
              <span>Assigned: {item.assignedQuantity}</span>
              <button
                className="bg-purple-300 hover:bg-purple-700 text-black py-2 px-4 rounded"
                onClick={() => addToReturn(item.itemId)}
              >
                Return
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="return-cart bg-gray-800 rounded-lg p-5 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-3">Return Cart</h2>
        <ul>
          {returnItems.map(item => (
            <li key={item.itemId} className="flex justify-between items-center bg-gray-700 rounded p-3 mb-3">
              <span>{item.itemName}</span>
              <span>ID: {item.itemId}</span>
              <span>Quantity: {item.assignedQuantity}</span>
              <div className="cart-buttons flex gap-3">
                <button
                  className="bg-purple-300 hover:bg-purple-700 text-black py-2 px-4 rounded"
                  onClick={() => decreaseReturnItem(item.itemId)}
                >
                  -
                </button>
                <button
                  className="bg-purple-300 hover:bg-purple-700 text-black py-2 px-4 rounded"
                  onClick={() => removeFromReturn(item.itemId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="submit-button w-full bg-purple-300 hover:bg-purple-700 text-black py-4 rounded mt-5 text-lg font-bold"
          onClick={handleReturnSubmit}
        >
          Return Items
        </button>
      </div>
    </div>
  );
}
