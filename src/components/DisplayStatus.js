import React from "react";

const DisplayStatus = ({ type, message }) => {
  const statusStyle = {
    color: 'black',
    backgroundColor: 'white',
    border: '1px solid black',
    borderRadius: '5px',
    textAlign: 'center',
    width: '40%',
    margin: '20px auto',
    padding: '10px 20px'
  };

  return (
    <div style={statusStyle}>
      {message}
    </div>
  );
};

export default DisplayStatus;