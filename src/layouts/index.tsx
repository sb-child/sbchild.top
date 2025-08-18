import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'umi'
import styles from './index.less'
import NavigationBar from './NavigationBar'

export default function Layout() {
  const [showExpand, setShowExpand] = useState(false)
  const [lastContainerWidth, setLastContainerWidth] = useState(0)
  const overflowDetectorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isCheckingRef = useRef(false)
  const animationCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // 强制检查溢出，不受当前 showExpand 状态限制
  const forceCheckOverflow = () => {
    // 防止重复检查
    if (isCheckingRef.current) return
    isCheckingRef.current = true

    setTimeout(() => {
      if (overflowDetectorRef.current && containerRef.current) {
        const detectorWidth = overflowDetectorRef.current.offsetWidth
        const containerWidth = containerRef.current.offsetWidth

        console.log('强制检查空间:', {
          detectorWidth,
          containerWidth,
          showExpand,
          lastContainerWidth,
        })

        if (!showExpand && detectorWidth < 64) {
          // 需要切换到 expand 模式
          console.log('切换到 expand 模式')
          setShowExpand(true)
          setLastContainerWidth(containerWidth)
        } else if (showExpand && containerWidth > lastContainerWidth + 5) {
          // 可以切换回 buttons 模式
          console.log('切换到 buttons 模式')
          setShowExpand(false)
          setLastContainerWidth(containerWidth)
        }
      }
      isCheckingRef.current = false
    }, 50)
  }

  // 处理动画状态变化的回调函数
  const handleAnimationStateChange = (isAnimating: boolean) => {
    console.log(
      '动画状态变化:',
      isAnimating ? '开始' : '结束',
      '当前showExpand:',
      showExpand,
    )

    // 清除之前的延迟检查
    if (animationCheckTimeoutRef.current) {
      clearTimeout(animationCheckTimeoutRef.current)
      animationCheckTimeoutRef.current = null
    }

    if (isAnimating) {
      // 动画开始时，立即强制检查一次空间
      console.log('动画开始，立即检查空间')
      forceCheckOverflow()
    } else {
      // 动画结束后，延迟强制检查以确保DOM已更新
      console.log('动画结束，延迟检查空间')
      animationCheckTimeoutRef.current = setTimeout(() => {
        console.log('延迟检查执行')
        forceCheckOverflow()
      }, 150) // 增加延迟时间以确保动画完全结束
    }
  }

  useEffect(() => {
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
      if (animationCheckTimeoutRef.current) {
        clearTimeout(animationCheckTimeoutRef.current)
      }
    }
  }, [showExpand, lastContainerWidth])

  return (
    <div className={styles.root}>
      <NavigationBar
        containerRef={containerRef}
        showExpand={showExpand}
        overflowDetectorRef={overflowDetectorRef}
        onAnimationStateChange={handleAnimationStateChange}
      />
      <div className={styles.navs_space}></div>
      <div className={styles.container}>
        <Outlet />
      </div>
      <div className={styles.bottom}>
        <p>sbchild.top 色妹妹的新站喵 Copyright © 2025</p>
        <p>附加信息...</p>
      </div>
    </div>
  )
}
