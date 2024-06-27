// src/components/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './NavBar.css';

Modal.setAppElement('#root');

const NavBar = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Arriendos Riobamba</Link>
        <div className="navbar-buttons">
          <button className="navbar-button" onClick={openModal}>Login</button>
          <Link to="/signup" className="navbar-button-link">Signup</Link>
        </div>
      </nav>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" required />
          </div>
          <button type="submit" className="modal-button">Login</button>
          <button type="button" className="modal-button" onClick={closeModal}>Close</button>
        </form>
      </Modal>
    </div>
  );
};

export default NavBar;
