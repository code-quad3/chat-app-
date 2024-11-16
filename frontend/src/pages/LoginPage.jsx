import { useState } from "react";
import { Mail, Lock, Axis3DIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import SocialLogin from "../components/SocialLogin";
import {z} from 'zod';
const loginSchema = z.object({
  email: z.string().email({ message :'Invalid email address'}),
  password: z.string().min(6, { message:'Password must be at least 6 character long'})
  .regex(/[A-Z]/, { message: `must contain at least one uppercase letter`})
  .regex(/\d/, { message: '  must contain at least one numeric digit'})
  .regex(/[@$!%*?&]/, { message: ' must contain at least one special character'}),
});





export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage , setErrorMessage] = useState({});
   const navigate = useNavigate();
  const handleSignupRedirect = () =>{
    navigate('/signup');
  };






  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading page

     const result = loginSchema.safeParse({email,password});
     if(result.success){
      setErrorMessage({});
     }
     else{
      setErrorMessage(result.error.flatten().fieldErrors);
      return;
     }


    try {
       const resopnse = await axios.post("http://localhost:4000/auth/login",{email,password});
       console.log("Login successful ",resopnse.data);
    } catch(error){
      setErrorMessage({fetch: 'Login failed! Due to network error , Please try again '});
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        {errorMessage && <p className="text-red-500 font-medium m-3 ">{errorMessage.fetch} </p>}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLoginSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-left"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />  
                
            
              </div>
              {errorMessage.email && <p className="mt-2 text-sm text-red-600">{errorMessage.email}</p>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 text-left"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            
              </div>
              {errorMessage.password && <p className="mt-2 text-sm text-red-600">{errorMessage.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="http://localhost:5173/forgot-password"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
             >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
                             <SocialLogin />
            
                      </div>
          <div className="mt-6">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-zinc-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={() => {
               return  handleSignupRedirect()}}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  ); 

}
