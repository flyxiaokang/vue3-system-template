/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2025-01-21 13:49:35
 * @LastEditors: kangjinrui
 * @LastEditTime: 2025-01-21 13:58:36
 */
import { useRouter } from 'vue-router'

export const logout = () => {
  const router = useRouter()
  router.push('/login')
  console.log('env=======',import.meta.env)
  // if(SINGLE_SIGN_CONFIG.cas.cas && import.meta.env)
  // window.location.replace('https://10.243.45.222/#/hbsw/home?isLogout=1')
}
