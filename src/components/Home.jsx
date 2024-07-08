import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase.js';  // Ensure you import auth
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [itemsList, setItemsList] = useState([
    { itemId: 1, itemName: 'Item 1', quantityAvailable: 10 },
    { itemId: 2, itemName: 'Item 2', quantityAvailable: 5 },
    { itemId: 3, itemName: 'Item 3', quantityAvailable: 8 },
  ]);

  useEffect(() => {
    // check authentication of the user
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/login');
    });

    axios.get('http://localhost:5001/get-items').then((res) => {
      if (res.status === 200) setItemsList(res.data.list);
      else alert("Some unexpected error occurred");
    }).catch((err) => {
      alert("Some unexpected error occurred");
      console.log(err);
    });

    return () => { unsub(); };
  }, [navigate]);

  const logout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <div className="home-page bg-gray-900 text-white min-h-screen flex flex-col items-center p-5">
      <div className="header w-full max-w-3xl flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Available Items</h2>
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
            </li>
          ))}
        </ul>
      </div>
      
      <div className="scan-button-container w-full max-w-3xl mt-auto pt-5">
        <button onClick={()=>{navigate('/student')}} className="scan-button w-full bg-purple-300 hover:bg-purple-700 text-black py-4 rounded text-lg font-bold">
          Scan the ID Card
        </button>
      </div>
    </div>
  );
}
