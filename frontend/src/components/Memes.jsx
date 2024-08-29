import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Memes = () =>{
  const [memes, setMemes] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () =>{
      try{
        const response = await axios.get("http://localhost:8080/api/memes");
        setMemes(response.data);
      }
      catch(error){
          console.error("error fetching data", error);
          setIsError(true);
      }
    };
  fetchData();
}, []);

if(isError){

}
return (
    <>
      <div className="grid grid-cols-4 gap-5">
        {memes.map((memes) => (
            <div
            key={memes.id}
            className="bg-gray-700 w-full h-[210px] shadow-lg rounded-lg overflow-hidden flex flex-col justify-start items-stretch"
          >
          <Link 
          to={`/memes/${memes.id}`}
          >
            <div>
              <h5 className="m-0 mb-2.5 text-lg">{memes.name}</h5>
              <i className="italic text-sm">{"by " + memes.description}</i>
            </div>
          </Link>
          </div>
        ))}
      </div>
    </>
  );
  
}
export default Memes;