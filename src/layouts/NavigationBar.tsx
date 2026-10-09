import { animate, createScope, Scope } from 'animejs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MenuItems from './MenuItems'
import styles from './index.less'

interface NavigationBarProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  showExpand: boolean
  overflowDetectorRef: React.RefObject<HTMLDivElement | null>
  onAnimationStateChange?: (isAnimating: boolean) => void
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  containerRef,
  showExpand,
  overflowDetectorRef,
  onAnimationStateChange,
}) => {
  // 状态管理：主标题和子标题内容
  const [mainTitle, setMainTitle] = useState('sbchild.top 新站')
  const [subTitle, setSubTitle] = useState('') // 子标题为空时显示状态1，否则显示状态2

  // 用于在动画过渡期间保持显示的子标题内容
  const [displayedSubTitle, setDisplayedSubTitle] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  // 用于子标题内容变化时的过渡动画
  const [isSubtitleTransitioning, setIsSubtitleTransitioning] = useState(false)
  // 使用 ref 来立即保存当前子标题，避免状态更新时序问题
  const currentSubTitleRef = useRef('')

  // DOM 引用
  const barRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const scope = useRef<Scope | null>(null)

  // 当前状态：1 = 显示主标题，隐藏子标题；2 = 主标题缩小，显示子标题
  const [currentState, setCurrentState] = useState<1 | 2>(1)

  // 初始化动画作用域
  useEffect(() => {
    if (!barRef.current || !titleRef.current || !subtitleRef.current) return

    scope.current = createScope({ root: barRef.current }).add(
      (animationScope: Scope | undefined) => {
        if (!animationScope) return
        // 定义切换到状态1的动画方法 (.title + .subtitle_hidden)
        animationScope.add('switchToState1', () => {
          // 动画状态已经在 switchToState1 中设置了
          // 使用 anime 在 CSS 类之间过渡
          if (titleRef.current && subtitleRef.current) {
            // 同时为两个元素应用过渡到状态1的动画
            animate([titleRef.current, subtitleRef.current], {
              duration: 100,
              ease: 'inOut(2)',
              complete: () => {
                // 动画完成后切换 CSS 类，延迟清空显示的子标题
                console.log('状态1动画完成')
                if (titleRef.current) {
                  titleRef.current.className = styles.title
                }
                if (subtitleRef.current) {
                  subtitleRef.current.className = styles.subtitle_hidden
                }
                setIsAnimating(false)
                onAnimationStateChange?.(false)
                // 延迟清空子标题内容，确保动画完全结束
                setTimeout(() => {
                  setDisplayedSubTitle('')
                }, 100)
              },
            })
          }
        })

        // 定义切换到状态2的动画方法 (.title_small + .subtitle)
        animationScope.add('switchToState2', () => {
          // 动画状态和子标题内容已经在 switchToState2 中设置了
          // 使用 anime 在 CSS 类之间过渡
          if (titleRef.current && subtitleRef.current) {
            // 同时为两个元素应用过渡到状态2的动画
            animate([titleRef.current, subtitleRef.current], {
              duration: 100,
              ease: 'inOut(2)',
              complete: () => {
                // 动画完成后切换 CSS 类
                console.log('状态2动画完成')
                if (titleRef.current) {
                  titleRef.current.className = styles.title_small
                }
                if (subtitleRef.current) {
                  subtitleRef.current.className = styles.subtitle
                }
                setIsAnimating(false)
                onAnimationStateChange?.(false)
              },
            })
          }
        })
      },
    )

    // 清理函数
    return () => scope.current?.revert()
  }, [subTitle])

  // 动画切换函数
  const switchToState1 = useCallback(() => {
    if (currentState === 1 || isAnimating) return
    console.log('开始切换到状态1')
    // 在切换到状态1之前，保存当前显示的子标题内容
    currentSubTitleRef.current = displayedSubTitle || subTitle
    setIsAnimating(true)
    onAnimationStateChange?.(true)
    setCurrentState(1)
    scope.current?.methods.switchToState1()
  }, [
    currentState,
    isAnimating,
    displayedSubTitle,
    subTitle,
    onAnimationStateChange,
  ])

  const switchToState2 = useCallback(() => {
    if (currentState === 2 || isAnimating) return
    console.log('开始切换到状态2')
    currentSubTitleRef.current = subTitle
    setDisplayedSubTitle(subTitle)
    setIsAnimating(true)
    onAnimationStateChange?.(true)
    setCurrentState(2)
    scope.current?.methods.switchToState2()
  }, [currentState, isAnimating, subTitle, onAnimationStateChange])

  // 子标题内容过渡动画函数
  const transitionSubtitleContent = useCallback(
    (newContent: string) => {
      if (!subtitleRef.current || isSubtitleTransitioning) return

      setIsSubtitleTransitioning(true)

      // 淡出当前内容
      animate(subtitleRef.current, {
        opacity: 0,
        duration: 100,
        ease: 'easeOut',
        complete: () => {
          // 更新内容
          setDisplayedSubTitle(newContent)
          currentSubTitleRef.current = newContent

          // 淡入新内容
          if (subtitleRef.current) {
            animate(subtitleRef.current, {
              opacity: 1,
              duration: 100,
              ease: 'easeIn',
              complete: () => {
                setIsSubtitleTransitioning(false)
              },
            })
          }
        },
      })
    },
    [isSubtitleTransitioning],
  )

  // 根据子标题内容切换状态
  useEffect(() => {
    if (subTitle.trim() === '') {
      // 在切换到状态1之前，先保存当前的子标题内容
      if (currentState === 2) {
        currentSubTitleRef.current = displayedSubTitle || subTitle
        setDisplayedSubTitle(displayedSubTitle || subTitle)
      }
      switchToState1()
    } else {
      // 如果当前已经在状态2，且子标题内容发生变化，执行内容过渡动画
      if (
        currentState === 2 &&
        displayedSubTitle !== subTitle &&
        displayedSubTitle !== ''
      ) {
        transitionSubtitleContent(subTitle)
      } else {
        switchToState2()
      }
    }
  }, [
    subTitle,
    scope.current,
    currentState,
    displayedSubTitle,
    transitionSubtitleContent,
  ])

  // 测试用：模拟子标题内容变化
  useEffect(() => {
    const t = setInterval(() => {
      setTimeout(() => {
        setSubTitle('这是一个子标题')
      }, 1000)
      setTimeout(() => {
        setSubTitle('222')
      }, 2000)
      setTimeout(() => {
        setSubTitle('333333333333333333')
      }, 3000)
      setTimeout(() => {
        setSubTitle('')
      }, 4000)
    }, 6000)

    return () => {
      clearInterval(t)
    }
  }, [])

  return (
    <div className={styles.navs}>
      <div ref={barRef} className={styles.bar}>
        <span
          ref={titleRef}
          className={currentState === 1 ? styles.title : styles.title_small}
        >
          {mainTitle}
        </span>
        <span
          ref={subtitleRef}
          className={
            currentState === 1 ? styles.subtitle_hidden : styles.subtitle
          }
        >
          {isAnimating
            ? currentSubTitleRef.current
            : currentState === 2
            ? displayedSubTitle
            : displayedSubTitle}
        </span>
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
