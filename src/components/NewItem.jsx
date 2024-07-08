import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase.js';

export default function NewItem() {
    const navigate = useNavigate();
    const [itemId, setItemId] = useState('');
    const [nameOfItem, setNameOfItem] = useState('');
    const [totalNumberOfItems, setTotalNumberOfItems] = useState('');

    useEffect(() => {
        // check authentication of the user
        const unsub = auth.onAuthStateChanged((user) => {
            if (!user) navigate('/login');
        });
        return () => { unsub(); };
    }, [navigate]);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        }).catch((error) => {
            alert('Error logging out');
            console.log(error);
        });
    };

    const handleAddItem = () => {
        const newItem = {
            itemId: parseInt(itemId),
            nameOfItem: nameOfItem,
            totalNumberOfItems: parseInt(totalNumberOfItems),
        };

        console.log(newItem);

        axios.put('http://localhost:5001/new-item', newItem)
            .then((res) => {
                if (res.status === 200) {
                    alert('Item added successfully');
                    navigate('/'); // Navigate to home page or another appropriate page
                } else {
                    alert('Some unexpected error occurred');
                }
            })
            .catch((err) => {
                alert('Some unexpected error occurred');
                console.log(err);
            });
    };

    return (
        <div className="add-item-page bg-gray-900 text-white min-h-screen flex flex-col items-center p-5">
          <div className="w-full flex justify-end">
            <button 
              onClick={handleLogout} 
              className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
          <h2 className="text-xl font-bold mb-5">Add New Item</h2>
    
          <div className="input-field mb-4 w-full max-w-3xl">
            <label className="block text-sm font-medium mb-2" htmlFor="itemId">Item ID</label>
            <input
              type="text"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>
    
          <div className="input-field mb-4 w-full max-w-3xl">
            <label className="block text-sm font-medium mb-2" htmlFor="nameOfItem">Name of Item</label>
            <input
              type="text"
              id="nameOfItem"
              value={nameOfItem}
              onChange={(e) => setNameOfItem(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>
    
          <div className="input-field mb-4 w-full max-w-3xl">
            <label className="block text-sm font-medium mb-2" htmlFor="totalNumberOfItems">Total Number of Items</label>
            <input
              type="number"
              id="totalNumberOfItems"
              value={totalNumberOfItems}
              onChange={(e) => setTotalNumberOfItems(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>
    
          <button
            onClick={handleAddItem}
            className="bg-purple-300 hover:bg-purple-700 text-black py-2 px-4 rounded font-bold"
          >
            Add Item
          </button>
        </div>
      );
}
