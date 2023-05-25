import * as actions from '../action_types'
import Helper from '../../commen/functions/history_logout'
import { BroadcastChannel } from 'broadcast-channel'

const logoutChannel = new BroadcastChannel('logout')

const signOut = (navigate, message) => {
  console.log('navigatenavigate')
  logoutChannel.postMessage('Logout')
  // if (Helper.socket != null) {
  //   Helper.socket.disconnect(true);
  // }
  window.location.href = window.location.origin + '/'
  // navigate("/");
  let RememberEmailLocal = JSON.parse(localStorage.getItem('rememberEmail'))
  let RememberPasswordLocal = JSON.parse(
    localStorage.getItem('remeberPassword'),
  )
  let reLang = localStorage.getItem('i18nextLng')
  if (RememberEmailLocal === true && RememberPasswordLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem('rememberEmailValue')

    let RememberPasswordLocalValue = localStorage.getItem(
      'rememberPasswordValue',
    )
    localStorage.clear()
    if (reLang != undefined && reLang != null) {
      localStorage.setItem('i18nextLng', reLang)
    }
    localStorage.setItem('remeberPassword', RememberPasswordLocal)
    localStorage.setItem('rememberPasswordValue', RememberPasswordLocalValue)
    localStorage.setItem('rememberEmail', RememberEmailLocal)
    localStorage.setItem('rememberEmailValue', RememberEmailLocalValue)
  } else if (RememberEmailLocal === true) {
    let RememberEmailLocalValue = localStorage.getItem('rememberEmailValue')
    localStorage.clear()
    if (reLang != undefined && reLang != null) {
      localStorage.setItem('i18nextLng', reLang)
    }
    localStorage.setItem('rememberEmail', RememberEmailLocal)
    localStorage.setItem('rememberEmailValue', RememberEmailLocalValue)
  } else if (RememberPasswordLocal === true) {
    let RememberPasswordLocalValue = localStorage.getItem(
      'rememberPasswordValue',
    )
    localStorage.clear()
    if (reLang != undefined && reLang != null) {
      localStorage.setItem('i18nextLng', reLang)
    }
    localStorage.setItem('remeberPassword', RememberPasswordLocal)
    localStorage.setItem('rememberPasswordValue', RememberPasswordLocalValue)
  } else {
    localStorage.clear()
    if (reLang != undefined && reLang != null) {
      localStorage.setItem('i18nextLng', reLang)
    }
    localStorage.setItem('rememberEmail', false)
    localStorage.setItem('rememberEmailValue', '')
    localStorage.setItem('remeberPassword', false)
    localStorage.setItem('rememberPasswordValue', '')
  }
  if (message != '') {
    return {
      type: actions.SIGN_OUT,
      message: message,
    }
  } else {
    return {
      type: actions.SIGN_OUT,
    }
  }
}

const logoutAllTabs = () => {
  logoutChannel.onmessage = () => {
    signOut()
    logoutChannel.close()
  }
}

export { signOut, logoutAllTabs }
