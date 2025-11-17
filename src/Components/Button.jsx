import React from 'react';

const Button = ({ icon: Icon, text, className }) => {
  return (
    <button className={`flex items-center gap-2 px-4 py-2 rounded ${className}`}>
      {Icon && <Icon size={20} />}
      {text}
    </button>
  );
};

export default Button;
