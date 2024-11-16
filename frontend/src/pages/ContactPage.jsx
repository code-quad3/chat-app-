import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,Spinner,
  Typography
,Dialog,
DialogHeader,
DialogBody,
DialogFooter,
Button,
Alert

} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ContactPage() {
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = ()=> setOpen(!open);
 const [firendToDelete, setFriendToDelete] = useState(null);
 const [altOpen, setaltOpen] = useState(false);
  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Get the token if needed

        const response = await axios.get("http://localhost:4000/user/contacts", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token if authentication is needed
          },
        });

        setFriendsData(response.data); // Set data from API response
      } catch (err) {
        console.error(err);
        setError("Failed to fetch contacts");
        if(err.response === 401){
          window.location.href= 'http://localhost:5173/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleClick = (friend) => {
    navigate(`/chat/${friend._id}`, { state: { name: friend.name } });
  };

  if (loading) return (
  <div className="grid  h-full w-full place-items-center">
    <Spinner  /></div>)
  ;
  if (error) return <Typography>{error}</Typography>;

  
    
  
    const handleDelete = async () => {
    if(!firendToDelete) return;

      try { const token = localStorage.getItem('token');
    const response =    await axios.post(`http://localhost:4000/user/remove-friend`,{
      headers: {
        Authorization: `Bearer ${token}`, // Pass token if authentication is needed
      }

    }, {friendId: firendToDelete._id});
    
        if(response.status===200){
          setFriendsData(friendsData.filter((friend)=> friend._id !== firendToDelete._id));
          handleOpen(); 
          setError('noEr');
          setFriendToDelete(null);
          }
          else if(response.status ===500){
              setError('Er');
              setFriendToDelete(null);
          }
       

      } catch (error) {
        console.error('Error deleting friend:', error);
        
      } 
}






  return (
          <>
        
        <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Alert </DialogHeader>
        <DialogBody>
          Are you sure you want delete
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen} // delete using friend._id  using axios
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleDelete}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

    <div className="flex justify-center p-4">
        {(setError ==='Er')&&(<Alert open ={altOpen} onClose={()=> setaltOpen(true) } color="red">Error ocuured please try again</Alert>)}
        {(setError ==='NoEr')&&(<Alert open ={altOpen} onClose={()=> setaltOpen(true)} color="green">Sucessfully deleted</Alert>)}
      <Card className="w-full sm:w-80 md:w-96 lg:w-[28rem] mx-auto">
        <List> {friendsData.length===0 &&<p>no friends</p>}
          {friendsData.map((friend) => (
            <ListItem
              key={friend._id}
              ripple={false}
              className="py-1 pr-1 pl-4"
              onClick={() => {
                
                
                return handleClick(friend)}}
            >
              <span className="flex flex-col">
                <span>{friend.name}</span>
                <span className="text-sm text-gray-500">{friend.status}</span>
              </span>
              <ListItemSuffix>
                <IconButton variant="text" color="blue-gray" onClick={(e)=>{
                  e.stopPropagation();
                    setFriendToDelete(friend);
                    return  handleOpen()
                }}>
                  <TrashIcon  />
                </IconButton>
              </ListItemSuffix>
            </ListItem>
          ))}
        </List>
      </Card>
    </div> 
    </>
  );
}
