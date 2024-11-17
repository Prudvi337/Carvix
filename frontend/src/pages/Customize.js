// Customize.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Customize.css';

const carModels = [
  {
    id: 'model1',
    name: 'Volkswagen Virtus GT',
    image: '/assets/virtus.png',
    modelPath: '/models/volkswagen_virtus_gt.glb',
    description: 'Sporty design with enhanced performance.',
  },
  {
    id: 'model2',
    name: 'Volkswagen Passat',
    image: '/assets/passat.png',
    modelPath: '/models/volkswagen_passat.glb',
    description: 'Elegant and efficient with advanced safety features.',
  },
  {
    id: 'model3',
    name: 'Volkswagen Polo',
    image: '/assets/Polo.png',
    modelPath: '/models/volkswagen_polo.glb',
    description: 'Iconic design with powerful performance.',
  },
];

const Customize = () => {
  const navigate = useNavigate();

  const handleSelectModel = (model) => {
    navigate(`/customize/${model.id}`, { state: { modelPath: model.modelPath } });
  };

  return (
    <div className="customize">
      <h1>Select a Car Model to Customize</h1>
      <div className="car-models">
        {carModels.map((model) => (
          <div
            key={model.id}
            className="car-model"
            onClick={() => handleSelectModel(model)}
          >
            <img src={model.image} alt={model.name} />
            <h2>{model.name}</h2>
            <p>{model.description}</p>
            <button>Select {model.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customize;
