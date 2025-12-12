import React from 'react';
import styles from './styles.module.css';

const PrintFriendlyHeader = ({ title, subtitle }) => {
  return (
    <div className={styles.printHeader}>
      <h1 className={styles.mainTitle}>{title || 'AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics'}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
      <hr className={styles.divider} />
      <div className={styles.printInfo}>
        <p>Date Printed: {new Date().toLocaleDateString()}</p>
        <p>Page: <span className="pageNumber"></span> of <span className="totalPages"></span></p>
      </div>
      <div className={styles.copyright}>
        <p>© {new Date().getFullYear()} AI/Spec-Driven Textbook for Physical AI & Humanoid Robotics. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrintFriendlyHeader;