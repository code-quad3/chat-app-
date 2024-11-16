import{
    Card,CardBody,Input,Button,Typography,Alert
} from '@material-tailwind/react';
import { useState } from 'react';
import axios from 'axios';
import {z} from 'zod';
const loginSchema = z.object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/\d/, { message: 'Password must contain at least one numeric digit' })
      .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters long' })
  });
  
  function FgForm() {
    // State hooks for the form fields
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
      const[Code,setCode] = useState(''); 
     // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Reset previous errors
      setError(null);
  
      // Validate password and confirm password
      const result = loginSchema.safeParse({ password, confirmPassword });
  
      // If validation fails, set error message
      if (!result.success) {
        setError(result.error.errors[0].message);
        return;
      }
  
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        //
        const response = await axios.post('https://localhost:4000/auth/reset-password', { newPassword:password, token: Code });
  
        // Handle API success
        if(response.status ==200){
            window.location.href='http://localhost:5173/login';
        }
        console.log('Password reset successful:', response.data);
      } catch (error) {
        // Handle API error
        setError('Failed to reset password Please try again');
        console.error(error);
      }
    };
  
    return (
      <Card color="transparent" shadow={false} className="flex justify-center items-center h-screen">
        <Typography variant="h4" color="blue-gray">
          Enter your password
        </Typography>
  
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
  
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Confirm your password
            </Typography>
            <Input
              type="password"
              size="lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />

<Typography variant="h6" color="blue-gray" className="-mb-3">
              Enter your code
            </Typography>
            <Input
              type="password"
              size="lg"
              value={Code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />




          </div>
  
          {error && (
            <Typography variant="body2" color="red" className="mt-4 text-center">
              {error}
            </Typography>
          )}
  
          <Button type="submit" className="mt-6" fullWidth onClick={handleSubmit}>
            Enter
          </Button>
        </form>
      </Card>
    );
  }








function EmailForm({setIsFgFormSubmitted}){
const[email,setEmail]=useState('');
const [open, setOpen] =useState(false);

const handleEmailChange =(e) =>{
    setEmail(e.target.value);
}


 const SendToken = async (e)=>{
  e.preventDefault();
    if(!email){
        return;
    }
      
     try{
      
       const response = await axios.post('http://localhost:4000/auth/forgot-password',{Email: email});
       console.log(response);
       if(response.status=== 200){
            setIsFgFormSubmitted(false);
       }
       
     }  catch(error){
            console.log(error);
          
              setOpen(true);
          
     }  
 }



    return (

          <>
        {open && <Alert open={open} onClose={() => setOpen(false)} color="red">
                Error ocuured please try again 
      </Alert>}
               
      <Card color="transparent" shadow={false} className="flex justify-center items-center h-screen">
        <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
          Enter your email
        </Typography>
        <CardBody className="w-full max-w-md">
          <form className="mt-8 mb-2 w-full">
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="-mb-3 text-center">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleEmailChange}
              />
            </div>
            <Button onClick={SendToken} className="mt-6" fullWidth >
              Enter
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
    );
  }
  



function FgpwdPage(){
  const [isFgFormSubmitted, setIsFgFormSubmitted] = useState(true);
  


    return(
    <>
    
   {isFgFormSubmitted &&<EmailForm  setIsFgFormSubmitted={setIsFgFormSubmitted}/>}
   {!isFgFormSubmitted &&<FgForm />}
    </>
    )
}



export default FgpwdPage;