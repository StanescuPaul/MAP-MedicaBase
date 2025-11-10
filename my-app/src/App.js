import React from 'react';
import './App.css';
import { useState } from 'react';

const initialList = [];
let counter = 0;

export default function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(initialList);

  function handleAdd(){
      let newPerson = [...list, {id: counter++, name: name}];
      setList(newPerson);
      setName("");
      console.log(newPerson);
  }

  return (
    <div className="container">
      <div className='inputBody'>  
        <input className="inputName" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name"/>
        <button className="submitButton" onClick={handleAdd}>Submit</button>
      </div>
    </div>
  );
}


