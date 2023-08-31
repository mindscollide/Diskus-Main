import React, { Suspense, useEffect } from 'react'
import './App.css'
import './Fonts.css'
import './fr.css'
import './ar.css'
import { logoutAllTabs } from './store/actions/Auth_Sign_Out'
import moment from 'moment'
import './assets/font-icons/font-icons.css'
const App = () => {
  useEffect(() => {
    logoutAllTabs()
  }, [])
  moment.tz.setDefault('America/New_York')
}

export default App
