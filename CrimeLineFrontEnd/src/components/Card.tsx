import React from 'react';

interface CardProps {
    caseName: string;
    type: string;
    description: string;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ caseName,type, description, onClick }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg p-4 bg-white border-2 border-gray-800 w-96 h-44 cursor-pointer hover:contrast-75" onClick={onClick}>
        <div className="font-bold font-mono text-2xl mb-5 mt-2 flex justify-center">{caseName}</div>
        <div className='font-mono'>
            <p className="text-gray-700 text-base flex justify-center">Type: {type}</p>
            <p className="text-gray-700 text-base flex justify-center">{description}</p>
        </div>
    </div>
  );
};

export default Card;
