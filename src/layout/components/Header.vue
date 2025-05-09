<template>
  <div class="header" :style="getHeaderStyle">
    <div class="header-left">
      <div class="logo normal-logo">
        <!-- <img :src="logoSrc" style="" alt="" /> -->
        <el-image
          style="
            width: 100%;
            display: flex;
            align-items: center;
            scale: 1;
            justify-content: space-around;
          "
          :src="logoSrc"
          :fit="'fill'"
        >
          <template #error>
            <img :src="minilogoSrc" style="" alt="" />
            <span style="font-size: 20px">{{ title }}</span>
          </template>
        </el-image>
      </div>

      <div class="logo mini-logo">
        <img :src="minilogoSrc" style="" alt="" />
      </div>
      <Menu />
    </div>
    <div class="header-right" v-if="showUser">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <div class="btn-bell" v-if="showMessage">
          <el-tooltip
            effect="dark"
            :content="message ? `有${message}条未读消息` : `消息中心`"
            placement="bottom"
          >
            <router-link to="/tabs">
              <el-icon color="white">
                <bell-filled />
              </el-icon>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <!-- <img src="../../assets/images/user2.png" /> -->
        </div>
        <!-- 用户名下拉菜单 -->
        
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link" style="display: flex;align-items: center;">
            <el-icon style="font-size: 20px;margin-right: 10px;"><UserFilled /></el-icon>
            <div class="ellipsis">{{ username }}</div>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item command="user">个人中心</el-dropdown-item> -->
              <el-dropdown-item divided command="loginout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import { useTagsStore } from '@/store/tags'
import { useRouter } from 'vue-router'
import Menu from '../components/Menu-new.vue'
import setting from '@/setting'
import { clearStorage, clearTokens, removeToken } from '@/utils/auth'
// import userAvator from "../../assets/images/img.jpg";

export default {
  components: {
    Menu,
  },
  setup() {
    const title = ref(setting.title)
    const logoName = setting.logoName
    const miniLogoName = setting.miniLogoName
    const showUser = setting.showUser
    const showMessage = setting.showMessage
    const username = localStorage.getItem('mp_sys_username')
    const message = 2

    const store = useTagsStore()
    const collapse = computed(() => store.collapse)
    // 侧边栏折叠
    const collapseChage = () => {
      // store.commit('app/handleCollapse', !collapse.value)
    }

    const logoSrc = new URL(
      `../../assets/images/logo/${logoName}.png`,
      import.meta.url
    ).href

    const minilogoSrc = new URL(
      `../../assets/images/logo/${miniLogoName}-mini.png`,
      import.meta.url
    ).href

    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage()
      }
    })

    // 用户名下拉菜单选择事件
    const router = useRouter()
    const handleCommand = (command) => {
      if (command == 'loginout') {
        clearStorage()
        clearTokens()
        // console.log('import.meta.env===', import.meta.env)
        if (
          SINGLE_SIGN_CONFIG.cas.cas &&
          import.meta.env.MODE === 'production'
        ) {
          window.location.replace(
            'https://10.243.45.222/#/hbsw/home?isLogout=1'
          )
        } else {
          router.push('/login')
        }
      } else if (command == 'user') {
        router.push('/user')
      }
    }

    const getHeaderStyle = computed(() => {
      return {
        'background-color': setting.theme.background,
      }
    })

    return {
      title,
      logoSrc,
      minilogoSrc,
      username,
      showUser,
      showMessage,
      message,
      collapse,
      getHeaderStyle,
      collapseChage,
      handleCommand,
    }
  },
}
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  padding: 0px 10px;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  position: relative;
  float: left;
  height: 100%;
  font-size: 18px;
  text-align: right;
  line-height: 70px;
  font-weight: bold;
}

.logo img {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 46px;
  height: 46px;
}

.header-left {
  width: calc(100% - 200px);
  height: 100%;
}

.header-right {
  float: right;
  width: 200px;
  /* padding-right: 50px; */
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-around;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
  font-size: 16px;
  min-width: 90px;
}

.user-avator {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}

.normal-logo {
  max-width: 330px;
  min-width: 200px;
  padding: 0 30px 0 10px;
  display: flex;
  align-items: center;
}

.normal-logo img {
  left: 10%;
}

.mini-logo {
  width: 80px;
  padding: 0 20px 0 20px;
}

.mini-logo img {
  left: 50%;
  /* position:absolute;
  clip:rect(0px 50px 50px 0px); */
}

:deep(.ellipsis) {
  max-width: 100px; /* 设置一个固定的宽度 */
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

@media (min-width: 1300px) {
  .mini-logo {
    display: none;
  }
}

@media (max-width: 1300px) {
  .normal-logo {
    display: none;
  }
}
</style>
