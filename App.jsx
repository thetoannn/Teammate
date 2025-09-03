import React, { useState } from 'react';
import ModalForm from './ModalForm';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <div className="demo-container">
        <h1>Modal Form Demo</h1>
        <p>Click the button below to open the modal form</p>
        <button className="demo-button" onClick={openModal}>
          Mở Modal Form
        </button>
      </div>
      
      <ModalForm 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />
    </div>
  );
}

export default App;