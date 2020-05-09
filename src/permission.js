/* eslint-disable prefer-const */
import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'
import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasLogin = localStorage.getItem('hasLogin')
  if (hasLogin) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // const hasRoute = (store.getters.userInfo.routes && store.getters.userInfo.routes.length > 0) || false
      // if(hasRoute) {
      //   next()
      // } else {
      //   try {
      //     const res = await store.dispatch('user/getUserInfo')
      //     console.log(res)
      //   } catch(e) {
      //     next()
      //     NProgress.done()
      //   }
      // }
      next()
      NProgress.done()
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
