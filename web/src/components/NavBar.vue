<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" :to="{name: 'home'}">Which Snake is Best</router-link>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            //下面用三元表达式看当前在哪个页面
            <li class="nav-item">
              <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">对战</router-link>
            </li>
            <li class="nav-item">
              <router-link :class="route_name == 'record_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'record_index'}">对局列表</router-link>
            </li>
            <li class="nav-item">
              <router-link :class="route_name == 'ranklist_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'ranklist_index'}">排行榜</router-link>
            </li>
          </ul>
          <ul class="navbar-nav" v-if="$store.state.user.is_login">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ $store.state.user.username }}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
    
                    <router-link class="dropdown-item" :to="{name: 'user_bot_index'}">我的Bot</router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click="logout">退出</a></li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav" v-else-if="!$store.state.user.pulling_info">
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_login' }" role="button">
            登录
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{name: 'user_account_register'}" role="button">
            注册
          </router-link>
        </li>
      </ul>
        </div>
      </div>
    </nav>
    </template>
    
    <script>
    import { useRoute } from 'vue-router'
    import { computed } from 'vue' //当需要实时计算的时候就需要用到他
    import { useStore } from 'vuex';

    //取得现在在哪个地方
    export default {
        setup() {
          const store = useStore();
            const route = useRoute();
            let route_name = computed(() => route.name)

            const logout = () => {
          store.dispatch("logout");
        }

            return {
              route_name,
            logout
            }
        }
    }
    </script>
    
    <style scoped>              /*scoped的作用是在这里写的css样式会加上随机字符串是的这里的样式不会影响到组件以外的东西*/
    
    </style> 
   
    