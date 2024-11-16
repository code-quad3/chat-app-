import React,{useEffect} from "react";
import { Card, Typography, Input, CardBody, Button } from '@material-tailwind/react';
import { Pencil,LogOut } from 'lucide-react';
import axios from "axios";
function ProfilePage() {
const[user,Setuser]=React.useState(null); //getting error 

  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [isEditingStatus, setIsEditingStatus] = React.useState(false);

  useEffect(() => {  
    console.log("use effect is called");
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/user/profile`,{
          headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        });
        
        console.log(response.data);
           Setuser(response.data);
          
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        if(error.status=== 401){
          window.location.href='http://localhost:5173/login';
        }
      }
    };
    fetchProfile();
  },[]);







  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangeStatus = (e) => setStatus(e.target.value);
  
  const toggleEditingEmail = () => setIsEditingEmail(!isEditingEmail);
  const toggleEditingStatus = () => setIsEditingStatus(!isEditingStatus);
  
  const saveEmail = async () => {
    try {
      await axios.put(`http://localhost:4000/user/update`, { email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const cancelEditEmail = () => {
    setEmail(user.email);
    setIsEditingEmail(false);
  };
  
  const saveStatus = async () => {
    try {
      await axios.put(`http://localhost:4000/user/update`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const cancelEditStatus = () => {
    setStatus(user.status);
    setIsEditingStatus(false);
  };
   if(!user){
    return<p>Loding......</p>
   }



  return (
    <Card className="p-4 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
             
     <CardBody className="space-y-6">
        {/* User Info */}
        <Typography variant="h5" className="font-bold mb-4 text-center sm:text-left">
          {user?.name}
        </Typography>

        {/* Conditional Status Input */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
          {isEditingStatus ? (
            <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex items-center space-x-2">
              <Input
                type="text"
                label="Status"
                value={status}
                onChange={onChangeStatus}
                className="flex-grow"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <Button size="sm" color="blue" onClick={saveStatus} className="rounded">
                Save
              </Button>
              <Button size="sm" color="red" onClick={cancelEditStatus} className="rounded">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center w-full space-x-2">
              <Typography  color="gray" className="italic">
                {user?.status}
              </Typography>
              <Pencil 
                className="text-gray-500 cursor-pointer hover:text-blue-500" 
                onClick={toggleEditingStatus} 
                aria-label="Edit Status"
                size={16}
              />
            </div>
          )}
        </div>

        {/* Conditional Email Input */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-2">
          {isEditingEmail ? (
            <div className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg flex items-center space-x-2">
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={onChangeEmail}
                className="flex-grow"
                containerProps={{
                  className: "min-w-0",
                }}
              />
              <Button size="sm" color="blue" onClick={saveEmail} className="rounded">
                Save
              </Button>
              <Button size="sm" color="red" onClick={cancelEditEmail} className="rounded">
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center w-full space-x-2">
              <Typography  color="gray">
                { user.email }
              </Typography>
              <Pencil 
                className="text-gray-500 cursor-pointer hover:text-blue-500" 
                onClick={toggleEditingEmail} 
                aria-label="Edit Email"
                size={16}
              />
            </div>
          )}
        </div>

        {/* QR Code Text */}
        <Typography className="mt-4 text-center sm:text-left">
         <a href="http://localhost:5173/qr-page" >QR Code </a>
      </Typography>
        <Typography className="mt-4 text-center sm:text-left">
         <a href="http://localhost:5173/contact" >Contact </a>
    </Typography>
      <Typography className="mt-4 text-center sm:text-left">
        <div className="flex flex-row gap-2"><span><LogOut className="text-red-600" /></span> <button onClick={()=>{
           localStorage.removeItem('token');
           window.location.href= "http://localhost:5173/login";
        
        
        }} >log out</button>
        </div>
    </Typography>
      </CardBody> 

    </Card>
  );
}

export default ProfilePage;

