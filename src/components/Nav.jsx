'use client'
import React, { useState } from 'react';
import { Button, Modal, Space } from 'antd';
import styles from '@/styles/home/nav.module.scss'
const Nav = () => {
  const [open, setOpen] = useState(false);
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  
  return (
    <div className={styles.nav}>
      <button className="bg-red-600 text-white rounded px-5 py-2 ml-4 h-fit"
        onClick={() => setOpen(true)}
      >
        Gia hạn bản Pro
      </button>
      {open && (
        <>
         <Modal
            open={open}
            title="Title"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={(_,) => (
              <>
                <Button>Custom Button</Button>
              </>
        )}
      >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>
        </>
      )}
    
    </div>
  );
};
export default Nav;