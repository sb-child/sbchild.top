import React from 'react'
import MenuItems from './MenuItems'
import styles from './index.less'

interface NavigationBarProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  showExpand: boolean
  overflowDetectorRef: React.RefObject<HTMLDivElement | null>
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  containerRef,
  showExpand,
  overflowDetectorRef,
}) => {
  return (
    <div className={styles.navs}>
      <div className={styles.bar}>
        <span className={styles.title}>sbchild.top 新站</span>
        <span className={styles.subtitle_hidden}>子标题</span>
        {/* <span className={styles.title_small}>sbchild.top 新站</span>
        <span className={styles.subtitle}>子标题</span> */}
      </div>
      <div ref={containerRef}>
        {showExpand ? (
          <div className={styles.expand}>
            <button className={styles.item}>显示菜单</button>
          </div>
        ) : (
          <div className={styles.buttons}>
            <div
              ref={overflowDetectorRef}
              className={styles.overflow_detector}
            ></div>
            <MenuItems />
          </div>
        )}
      </div>
    </div>
  )
}

export default NavigationBar
