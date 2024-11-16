import React from 'react';
import QRCode from 'react-qr-code';



import {
    Card,
    CardBody,
    
    Typography,
  
  } from "@material-tailwind/react";
   
   function QrCodeGenerator({userId}){
    const qrData =`${userId}`;
    return (
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Scan Qr for Add friend
          </Typography>
          <div className='relative w-full aspect-square'>
        <QRCode value ={qrData} style={{position: 'absolute' ,top: 0,left: 0, width: '100%' ,height: '100%'}}/>  {/* size must be responsive*/}
    </div>
        </CardBody>
    
      </Card>
    );
  }

export default QrCodeGenerator;
