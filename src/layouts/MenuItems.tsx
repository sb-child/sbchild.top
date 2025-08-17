import styles from './index.less'

export default function MenuItems() {
  return (
    <>
      <button className={styles.item}>友情链接</button>
      <button className={styles.item}>关于我</button>
      <button className={styles.item}>博客</button>
    </>
  )
}
