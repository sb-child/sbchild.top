import React from 'react'
import { Link, useLocation } from 'umi'
import styles from './index.less'

export default function MenuItems() {
  const location = useLocation()

  return (
    <>
      <MenuItem route="/">主页</MenuItem>
      <MenuItem route="/friends">友情链接</MenuItem>
      <MenuItem route="/about">关于我</MenuItem>
      <MenuItem route="/blog">博客</MenuItem>
    </>
  )
}

function MenuItem(props: { route: string; children: React.ReactNode }) {
  const location = useLocation()
  const matched = location.pathname == props.route

  return (
    <>
      <Link to={props.route}>
        <button className={matched ? styles.matched_item : styles.item}>
          {props.children}
        </button>
      </Link>
    </>
  )
}
