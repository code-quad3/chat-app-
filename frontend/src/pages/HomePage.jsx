import Header from "../components/Header";
import List from "../components/List";
import BottomNavbar from "../components/BottomNavbar";
import React, { useEffect, useState} from "react";
import axios from "axios";

function HomePage(){
    const [isDarkMode,setIsDarkMode] = useState(false);
    const toogleDarkMode = ()=>{
      setIsDarkMode(prevMode => !prevMode);
    }
const [data,setData] = useState([]);

useEffect(()=>{
  const fetchCombinedData = async () => {
try {
  const response = await axios.get('http://localhost:4000/user/contact-data',
    {
    headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
  });
setData(response.data);
  

}catch(error){
  if(error.status===401){
    window.location.href='http://localhost:5173/login';
  }
}

  };
     fetchCombinedData();
},[]);

    return(
    <div className= "h-screen relative ">
  <Header title = {"Contacts"} isDarkMode={isDarkMode} toggleDarkMode={toogleDarkMode} />

        <List items={data} isDarkMode={isDarkMode} type="contact"/>
        <BottomNavbar />
</div>
    )
}
export default HomePage;