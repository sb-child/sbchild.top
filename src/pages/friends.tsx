import FriendLink from '@/components/FriendLink'
import baseStyles from './base.less'
import styles from './friends.less'

const FriendsPage = () => {
  return (
    <div className={baseStyles.page}>
      <h1>友情链接喵</h1>
      <p>喜欢加就多加喵。</p>
      <p>载入列表喵...</p>
      <div className={styles.friend_link_container}>
        <FriendLink />
        <FriendLink />
        <FriendLink />
        <FriendLink />
        <FriendLink />
        <FriendLink />
        <FriendLink />
      </div>
    </div>
  )
}

export default FriendsPage
