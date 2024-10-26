import React from 'react'
import styles from "./AdminPages.module.css";
import TopShopsPriority from './ShopsForms/TopShopsPriority';

const TopShops = () => {
  return (
    <div className={styles.main_body}>
        <div className={styles.configs_body}>
          <TopShopsPriority />
        </div>
    </div>
  )
}

export default TopShops
