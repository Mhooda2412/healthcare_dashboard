import React from 'react';
import { Link } from 'react-router-dom';
import lineChart from '../assets/images/line-chart.svg';

const cards = [
  { name: 'Enrollment Dashboard', imgSrc: lineChart, path: '/enrollment' }, 
];

const HomeCards = () => {
  return (
    <div className="p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div key={index}>
              <Link to={card.path}>
                <div className="bg-light-grey shadow-lg rounded-lg overflow-hidden">
                  <div className="w-full h-48 flex items-center justify-center border-none">
                    <img src={card.imgSrc} alt={card.name} className="object-contain w-full h-full" />
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="font-canela font-bold text-2xl text-dark-blue">{card.name}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
