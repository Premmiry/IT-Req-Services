// NoUser.tsx
import React from 'react';

interface NoUserProps {
  type: 'AD' | 'YH'; // กำหนดชนิดของ props ที่รับ
}

const NoUser: React.FC<NoUserProps> = ({ type }) => {
  return (
    <div>
      {type === 'AD' ? (
        <h2>No User Found in Active Directory</h2>
      ) : (
        <h2>No User Found in YH System</h2>
      )}
      {/* คุณสามารถเพิ่มเนื้อหาหรือการจัดรูปแบบเพิ่มเติมได้ที่นี่ */}
    </div>
  );
};

export default NoUser;
