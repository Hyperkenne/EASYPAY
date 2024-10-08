import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const QrCodeScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [userData , setuserData] = useState({});


  const getDataById = async (scanResult) => {
        await axios.post('http://localhost:4001/users/getuserById' , { userId : scanResult })
        .then((res) => {
            setuserData(res.data);
        })
        .catch((err) => {
        });
    }

    useEffect(()=>{
        if(scanResult){
            getDataById(scanResult);
            window.location.href = `/send?userId=${scanResult}`;
        }
    } , [scanResult])

    useEffect(()=>{

    })

  useEffect(() => {
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "reader", 
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      },
      false
    );

    const onScanSuccess = (decodedText, decodedResult) => {
      setScanResult(decodedText);
      console.log(`QR Code scanned: ${decodedText}`);
      sendToBackend(decodedText);
      html5QrCodeScanner.clear();
    };

    const onScanFailure = (error) => {
      console.warn(`QR Code scan error: ${error}`);
    };

    html5QrCodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      html5QrCodeScanner.clear();
    };
  }, []);

  const sendToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:4001/qrcode/scanQr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrData: data }),
      });

      const result = await response.json();
    } catch (error) {
      console.error('Error sending QR data to backend', error);
    }
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <div id="reader" style={{ width: '500px' }}></div>
      <p>Scanned Result: {scanResult}</p>
    </div>
  );
};

export default QrCodeScanner;
