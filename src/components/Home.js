// src/components/Home.js
import React from 'react';
import NavBar from './NavBar';
import './Home.css';

const arriendos = [
  { id: 1, title: 'Departamento céntrico', price: '$300', image: '/images/image.png' },
  { id: 2, title: 'Casa amplia', price: '$500', image: '/images/image.png' },
  { id: 3, title: 'Habitación económica', price: '$150', image: '/images/image.png' },
  { id: 4, title: 'Suite moderna', price: '$400', image: '/images/image.png' },
  { id: 5, title: 'Departamento amoblado', price: '$350', image: '/images/image.png' },
  { id: 6, title: 'Casa con jardín', price: '$450', image: '/images/image.png' },
  { id: 7, title: 'Habitación compartida', price: '$200', image: '/images/image.png' },
  { id: 8, title: 'Penthouse de lujo', price: '$800', image: '/images/image.png' },
];

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="home-container">
        <h1>Bienvenidos a Arriendos Riobamba</h1>
        <p>Encuentra los mejores arriendos en Riobamba.</p>
        <div className="cards-container">
          {arriendos.map((arriendo) => (
            <div className="card" key={arriendo.id}>
              <img src={arriendo.image} alt={arriendo.title} className="card-image" />
              <div className="card-content">
                <h3>{arriendo.title}</h3>
                <p>{arriendo.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
