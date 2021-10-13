import { AuthService } from '@xrengine/client-core/src/user/reducers/auth/AuthService'
import { useAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'
import { isIOS } from '@xrengine/client-core/src/util/platformCheck'
import FeedMenu from '../components/FeedMenu'
import { useCreatorState } from '@xrengine/client-core/src/social/reducers/creator/CreatorState'
import { CreatorService } from '@xrengine/client-core/src/social/reducers/creator/CreatorService'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import AppHeader from '../components/Header'

// @ts-ignore
import styles from './index.module.scss'
import AddFilesForm from '../components/AddFilesForm'

const Home = () => {
  const dispatch = useDispatch()
  const auth = useAuthState()

  const [addFilesView, setAddFilesView] = useState(false)
  const [filesTarget, setFilesTarget] = useState([])

  useEffect(() => {
    const user = auth.user
    const userId = user ? user.id.value : null
    if (userId) {
      CreatorService.createCreator()
    }
  }, [auth.isLoggedIn.value, auth.user.id.value])

  useEffect(() => {
    dispatch(AuthService.doLoginAuto(true))
  }, [])

  const creatorsState = useCreatorState()
  const currentCreator = creatorsState.creators.currentCreator.value

  return (
    <div className={styles.viewport}>
      {!addFilesView && (
        <AppHeader title={'CREATOR'} setAddFilesView={setAddFilesView} setFilesTarget={setFilesTarget} />
      )}
      {currentCreator && !addFilesView && <FeedMenu />}
      {addFilesView && (
        <AddFilesForm filesTarget={filesTarget} setAddFilesView={setAddFilesView} setFilesTarget={setFilesTarget} />
      )}
    </div>
  )
}

export default Home
