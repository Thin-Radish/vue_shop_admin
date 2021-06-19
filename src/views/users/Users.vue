<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" 
          v-model="queryInfo.query" clearable
          @clear="getUserList" >
            <!-- 搜索按钮 -->
            <el-button slot="append"
            icon="el-icon-search"
            @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>    
      
      <!-- 用户列表区 -->
      <el-table :data="userlist" stripe border>
        <el-table-column type="index"  label="#"></el-table-column>
        <el-table-column prop="username"  label="姓名"></el-table-column>
        <el-table-column prop="email"     label="邮箱"></el-table-column>
        <el-table-column prop="mobile"    label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column  label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="280px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit"  size="mini" @click="showEditDialog(scope.row.id)"/>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"/>
            <!-- 分配角色 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配权限" width="50%"
      :visible.sync="setRoleDialogVisible"
      @close="setRoleDialogClosed">
      <!-- 内容主体区 -->
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id"
            :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部区域 -->
      <span slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //网络请求api
  import { 
    getUserList_,
    userStateChanged_, addUser_,
    addUserById_,
    editUser_,
    deleteUserById_,
    setUserRole_
  } from 'api/users'
  import { checkEmail, checkMobile } from 'common/utils/validator'
  import { getRoleList_} from "api/roles"
  export default {
    name: "Users",
    data() {
      return {
        queryInfo: {
          query: '',
          //当前页数
          pagenum: 1,
          //当前每页显示多少条数据
          pagesize: 2
        },
        userlist: [],
        total: 0,
        //添加用户的对话框的显示与隐藏
        addDialogVisible: false,
        //添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        //添加表单的验证规则对象
        addFormRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {min: 3, max: 10, message: "用户名的长度在3至10字符之间", trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, max: 15, message: "密码的长度在3至10字符之间", trigger: "blur"}
          ],
          email: [
            {required: true, message: "请输入邮箱", trigger: "blur"},
            {validator: checkEmail, trigger: "blur"}
          ],
          mobile: [
            {required: true, message: "请输入手机号", trigger: "blur"},
            {validator: checkMobile, trigger: "blur"}
          ]
        },
        //修改用户的对话框的显示与隐藏
        editDialogVisible: false,
        editForm: {},
        //分配角色的对话框的显示与隐藏
        setRoleDialogVisible: false,
        //需要分配角色的用户信息
        userInfo: {},
        //所有角色的数据列表
        rolesList: [],
        //已选择的角色id值
        selectedRoleId: '',
      }
    },
    created() {
      this.getUserList();
    },
    methods: {
      async getUserList() {
        const { data: res } = await getUserList_(this.queryInfo)
        if(res.meta.status !== 200) return this.$message.error("获取用户列表失败!");
        this.userlist = res.data.users;
        this.total = res.data.total;
      },
      //监听pagesize变化事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getUserList();
      },
      //监听页码值改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getUserList();
      },
      async userStateChanged(userInfo) {
        const { data: res } = await userStateChanged_(userInfo);
        if(res.meta.status !== 200){
          userInfo.mg_state = !userInfo.mg_state;
          return this.$message.error("更新用户状态失败!")
        }
        this.$message.success("更新用户状态成功!")
      },
      //添加用户的对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      //添加新用户
      addUser() {
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return;

          const { data: res } = await addUser_(this.addForm);
          if(res.meta.status !== 201) return this.$message.error("添加用户失败!");
          
          this.$message.success("添加用户成功!");
          this.addDialogVisible = false;
          //重新获取用户列表
          this.getUserList();
        })
      },
      //修改用户信息
      async showEditDialog(id){
        const { data: res } = await addUserById_(id);
        if(res.meta.status !== 200) return this.$message.error("查询用户信息失败!");

        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      //添加用户的对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      editUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return;
          const { data: res } = await editUser_(this.editForm);
          if(res.meta.status !== 200) return this.$message.error("修改用户信息失败!");

          this.$message.success("修改用户信息成功!");
          this.editDialogVisible = false;
          //重新获取用户列表
          this.getUserList();
        })
      },
      async removeUserById(id) {
        //弹框询问是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== "confirm"){
          return this.$message.info("已取消删除!")
        }else{
          const { data: res } = await deleteUserById_(id);
          if(res.meta.status !== 200) return this.$message.error("删除用户失败!");

          this.$message.success("删除用户成功!");
          this.getUserList();
        }
      },
      //展示分配角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo;

        //先获取所有角色列表
        const { data: res } = await getRoleList_();
        if(res.meta.status !== 200) return this.$message.error("获取权限列表失败!");

        this.rolesList = res.data;
        this.setRoleDialogVisible = true;
      },
      async saveRoleInfo() {
        if(!this.selectedRoleId) return this.$message.error("请选择要分配的角色!");

        const { data: res } = await setUserRole_(this.userInfo.id, this.selectedRoleId);
        if(res.meta.status !== 200) return this.$message.error("更新角色失败!");

        this.$message.success("更新角色成功!");
        this.getUserList();
        this.setRoleDialogVisible = false;
      }, 
      setRoleDialogClosed() {
        this.selectedRoleId = '';
      }
    }
  }
</script>

<style lang="less" scoped>

</style>