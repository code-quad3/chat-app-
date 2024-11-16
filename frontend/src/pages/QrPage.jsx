import QrCodeGenerator from '../components/QrCodeGenerator';
import {jwtDecode} from "jwt-decode";
import { Button } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import{useNavigate} from 'react-router-dom';
  import QrCodeScanner from '../components/QrCodeScanner';

// Decode the JWT token to get the user ID


function QrPage() {
    const [userId,setUserId] =useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
        useEffect(()=>{
            if(token !==null){  
    
                const decoded = jwtDecode(token);
                 setUserId(decoded.id);
                 
            }else{
                navigate('/login');
            }
        },[token,navigate])

        


    const [readClick, setReadClick] = useState(true);
    const [scanClick, setScanClick] = useState(false);

    const handleReadClick = () => {
        setReadClick(true);
        setScanClick(false);
    };

    const handleScanClick = () => {
        setReadClick(false);
        setScanClick(true);
    };

    return (
        <div>
            <div className='flex justify-between mb-9'>
                <Button className='w-1/2 mr-8' variant='outlined' color='green' onClick={handleReadClick}>Read</Button>
                <Button className='w-1/2' variant='outlined' color='green' onClick={handleScanClick}>Scan</Button>
            </div>
            {readClick && <QrCodeGenerator userId={userId} />}
            {scanClick && <QrCodeScanner/>}
        </div>
    );
}

export default QrPage;




