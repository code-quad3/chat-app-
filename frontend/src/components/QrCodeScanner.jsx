import { useEffect, useRef, useState } from "react";
import axios from "axios";
// Styles
import "./QrStyles.css";
import {Alert} from "@material-tailwind/react";
// Qr Scanner
import QrScanner from "qr-scanner";
import QrFrame from "../assets/qr-frame (1).svg";

const QrCodeScanner = () => {
  // QR States
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);
   const [open, setOpen] = useState(false);
  // Result
  const [scannedResult, setScannedResult] = useState("");

  // Success
  const onScanSuccess = async (result) => {
      console.log(result?.data);
      console.log("scan sucessfull");
      const token = localStorage.getItem("token");
      setScannedResult(result?.data)
      scanner?.current?.stop();
      // 🖨 Print the "result" to browser console.
     
      //Make sure api hit only once and doesnt repeatedly calls
      try{
          const response =await axios.post(
              "http://localhost:4000/user/add-friend",{friendId: result?.data},{headers:{
                  Authorization:`Bearer ${token}`,
                },}
            );
            if(response.status=== 200){
            setScannedResult(result?.data);
          setOpen(true);
        }
        if(response.status=== 409){
          setScannedResult("eRRExist");
          setOpen(true);
        }
    
    }catch(error){
        setScannedResult("eRR");
        setOpen(true);
    }
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.

  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);
 


  const handleAlertClose = () => {
    setOpen(false);
    //setScannedResult("");
    
    scanner.current?.start().catch((err) => {
      console.error("Error restarting scanner:", err);
      setQrOn(false);
    });
  };


  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>

      {/* Show Data Result if scan is success */}
     

    {scannedResult &&(
    <Alert open ={open} onClose={handleAlertClose} color="green" className="absolute top-0 left-0">
       Sucessfully added 
    </Alert>
    )}
     
     {(scannedResult==="eRR") &&(
    <Alert open ={open} onClose={handleAlertClose} color="red" className="absolute top-0 left-0">
       Error ocurred please try again
    </Alert>
    )}


   
{(scannedResult==="eRRExist") &&(
    <Alert open ={open} onClose={handleAlertClose} color="yellow" className="absolute top-0 left-0">
       User already exist 
    </Alert>
    )}




    </div>
  );
};

export default QrCodeScanner