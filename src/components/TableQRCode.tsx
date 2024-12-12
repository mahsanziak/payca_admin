import React from 'react';
import QRCode from 'qrcode.react';
import styles from './TableQRCode.module.css';

interface TableQRCodeProps {
  restaurantId: string;
  tableId: string;
  tableNumber: number;
}

const TableQRCode: React.FC<TableQRCodeProps> = ({ restaurantId, tableId, tableNumber }) => {
  const downloadQRCode = () => {
    const canvas = document.getElementById(`qr-${tableId}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `table-${tableNumber}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className={styles.qrContainer}>
      <QRCode
        id={`qr-${tableId}`}
        value={`https://paycamenu.com/restaurants/${restaurantId}/tables/${tableId}`}
        size={128}
        level="H"
        includeMargin={true}
      />
      <button onClick={downloadQRCode} className={styles.downloadButton}>
        Download QR
      </button>
    </div>
  );
};

export default TableQRCode;