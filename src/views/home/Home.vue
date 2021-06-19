<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/home_login.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">登出</el-button>
    </el-header>
    <!-- 主页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->   
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" 
          unique-opened :collapse="isCollapse" :collapse-transition="false" 
          :default-active="activePath" router>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +'' "  v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" 
            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区 -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import getMenuList_ from "api/menus"
  export default {
    name: "Home",
    data() {
      return {
        //左侧菜单数据 
        menulist: [],
        iconObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        isCollapse: false,
        activePath: '',
      }
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
      logout() {
        window.sessionStorage.removeItem('token');
        this.$router.push('/login');
      },
      //切换菜单折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath);
        this.activePath = activePath;
      },
      async getMenuList() {
        const { data: res } = await getMenuList_();
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
        this.menulist = res.data;
      }
    }
  }
</script>

<style lang= "less" scoped>
  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
      }

    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    cursor: pointer;
    text-align: center;
    color: #fff;
  }

</style>