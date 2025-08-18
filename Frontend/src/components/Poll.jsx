import React from 'react';

const Poll = ({ poll, handleVote }) => {
  return (
    <div className="max-w-md mx-auto my-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{poll.question}</h2>
      <div className="space-y-2">
        {poll.options.map((option) => (
          <button
            key={option._id}
            onClick={() => handleVote(option)}
            className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
          >
            {option.text} 
            <span className="float-right font-semibold">{option.votes} votes</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Poll;