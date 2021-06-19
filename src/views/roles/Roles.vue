<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id"
            :class="{'bdbottom':true,'bdtop':i1 === 0,'vcenter':true}">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id"
                :class="{'bdtop':i2 !== 0,'vcenter':true}">
                  <el-col :span="6">
                    <el-tag type="success"  closable
                    @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" 
                    type="warning" :key="item3.id" closable
                    @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"    label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc"  label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger"  icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>      
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限" width="50%"
      :visible.sync="setRightDialogVisible"
      @close="setRightDialogClosed">
      <!-- 内容主体区 -->
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treePorps" 
      show-checkbox node-key="id" default-expand-all
      :default-checked-keys="defKeys"  ref="treeRef"/>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getRoleList_, deleteRightById_ , setRoleRights_} from "api/roles"
  import { getRightsList_ } from "api/rights"
  export default {
    name: "Roles",
    data() {
      return {
        roleList: [],
        setRightDialogVisible: false,
        rightsList: [],
        //树形控件的属性绑定对象
        treePorps: {
          label: 'authName',
          children: 'children'
        },
        //默认选中的节点id值数组
        defKeys: [],
        //当前即将发你配权限的id
        roleId: '',
      }
    },
    created() {
      //获取所有角色的列表
      this.getRoleList();
    },
    methods: {
      async getRoleList() {
        const { data: res } = await getRoleList_();
        if(res.meta.status !== 200) return this.$message.error("获取角色列表失败!");
      
        this.roleList = res.data;
      },
      //根据id删除对应的权限
      async removeRightById(role, rightId) {
        //弹框提示是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== "confirm"){
          return this.$message.info("已取消删除!")
        }else{
          const { data: res } = await deleteRightById_(role.id, rightId);
          if(res.meta.status !== 200) return this.$message.error("删除权限失败!");

          this.$message.success("删除权限成功!");
           //返回的data, 是当前角色下最新的权限数据
          role.children = res.data;
        }
      },
      //展示分配权限的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id;
        //获取全部权限数据
        const { data: res } = await getRightsList_('tree');
        if(res.meta.status !== 200) return this.$message.error("获取全部权限数据失败!");

        this.rightsList = res.data;
        //递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys);
        this.setRightDialogVisible = true;
      },
      //递归获取三级节点的id
      getLeafKeys(node, arr) {
        if(!node.children){
          return arr.push(node.id)
        }

        node.children.forEach(item => this.getLeafKeys(item, arr));
      },
      setRightDialogClosed() {
        this.defKeys = [];
      },
      //点击为角色分配权限
      async alloRights() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        const idStr = keys.join(',');
        
        const { data: res } = await setRoleRights_(this.roleId, idStr);
        if(res.meta.status !== 200) return this.$message.error("分配权限失败!");

        this.$message.success("分配权限成功!");
        this.getRoleList();
        this.setRightDialogVisible = false;
      }
    }
  }
</script>

<style lang="less" scoped>
    .el-tag {
      margin: 7px;
    }

    .bdtop {
      border-top: 1px solid #eee;
    }

    .bdbottom {
      border-bottom: 1px solid #eee;
    }

    .vcenter {
      display: flex;
      align-items: center;
    }
</style>