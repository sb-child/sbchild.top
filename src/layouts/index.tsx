import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'umi'
import styles from './index.less'
import MenuItems from './MenuItems'

export default function Layout() {
  const [showExpand, setShowExpand] = useState(false)
  const [lastContainerWidth, setLastContainerWidth] = useState(0)
  const overflowDetectorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isCheckingRef = useRef(false)

  useEffect(() => {
    const checkOverflow = () => {
      // 防止重复检查
      if (isCheckingRef.current) return
      isCheckingRef.current = true

      setTimeout(() => {
        if (!showExpand && overflowDetectorRef.current) {
          // 当前显示 buttons，检查 overflow_detector 宽度
          const detectorWidth = overflowDetectorRef.current.offsetWidth
          if (detectorWidth < 64) {
            setShowExpand(true)
            if (containerRef.current) {
              setLastContainerWidth(containerRef.current.offsetWidth)
            }
          }
        }
        isCheckingRef.current = false
      }, 50)
    }

    // 监听窗口大小变化
    const handleResize = () => {
      if (!containerRef.current) return

      const currentContainerWidth = containerRef.current.offsetWidth

      if (showExpand && currentContainerWidth > lastContainerWidth + 5) {
        // 容器宽度明显增加，尝试切换回 buttons
        setShowExpand(false)
        setLastContainerWidth(currentContainerWidth)
      } else if (!showExpand) {
        // 当前显示 buttons，检查是否需要切换到 expand
        checkOverflow()
      }
    }

    // 初始检查
    if (!showExpand) {
      setTimeout(checkOverflow, 100)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [showExpand, lastContainerWidth])

  return (
    <div className={styles.root}>
      <div className={styles.navs}>
        <div className={styles.bar}>
          <span className={styles.title}>sbchild.top 新站</span>
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
      <div className={styles.navs_space}></div>
      <Outlet />
    </div>
  )
}
