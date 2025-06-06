import React from 'react';
import { View, Text, Platform, Dimensions } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import QRCodeStyling from 'qr-code-styling';

const QRCodeGenerator = ({ gameCode }: { gameCode: string }): JSX.Element => {
  const qrSize = 200;
  const qrRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web' && qrRef.current) {
      const qr = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        data: gameCode,
        image: '',
        dotsOptions: {
          color: '#000',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
      });
      qr.append(qrRef.current);
    }
  }, [gameCode, qrSize]);

  return (
    <>
      {Platform.OS === 'web' ? (
        <View
          style={{ width: qrSize, height: qrSize, alignItems: 'center', justifyContent: 'center' }}
          ref={qrRef as any}
        />
      ) : (
        <QRCodeSVG value={gameCode} size={qrSize} />
      )}
    </>
  );
};

export default QRCodeGenerator;
