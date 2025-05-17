import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

const QRCodeGenerator = ({ text }:any) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: 'H',
      }, (error:any) => {
        if (error) console.error(error);
      });
    }
  }, [text]);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCodeGenerator;
