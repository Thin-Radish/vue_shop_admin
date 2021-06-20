<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告提示区域 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" 
      type="warning" :closable="false" show-icon/>

      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
          v-model="selectedCateKeys"
          :options="cateList"
          :props="cateProps"
          @change="handleChange"
          clearable>
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 参数列表区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" 
          :disabled="idBtnDisabled" size="mini"
          @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" 
                icon="el-icon-edit"
                @click="showEditDiglog(scope.row.attr_id)"></el-button>  
                <el-button type="danger" size="mini" 
                icon="el-icon-delete"
                @click="removeParams(scope.row.attr_id)"></el-button>  
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" 
          :disabled="idBtnDisabled" size="mini"
           @click="addDialogVisible = true">添加属性</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="onlyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" 
                icon="el-icon-edit"
                @click="showEditDiglog(scope.row.attr_id)"></el-button>  
                <el-button type="danger" size="mini" 
                icon="el-icon-delete"
                @click="removeParams(scope.row.attr_id)"></el-button>  
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数的对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="50%">
        <el-form ref="addFormRef" 
        :model="addForm" 
        label-width="80px"
        :rules="addFormRules">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数的对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        @close="editDialogClosed"
        width="50%">
        <el-form ref="editFormRef" 
        :model="editForm" 
        label-width="80px"
        :rules="addFormRules">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
    import { getCateList_ } from "api/goods"
    import {
      getParamsData_,
      addParams_, 
      getParamsById_, 
      editParams_ ,
      removeParams_,
    } from "api/params"
  export default {
    name: "Params",
    data() {
      return {
        cateList: [],
        //级联选择框双向绑定的数组
        selectedCateKeys: [],
        //指定级联选择器的配置对象
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover',
        },
        //被激活页签的名称
        activeName: 'many',
        //动态参数的数据
        manyTableData: [],
        //静态参数的数据
        onlyTableData: [],
        //控制添加参数的对话框显示与隐藏
        addDialogVisible: false,
        //添加参数的表单数据
        addForm: {
          attr_name: '',
        },
        //添加参数的表单验证规则
        addFormRules: {
          attr_name: [
            {required: true, message: "请输入参数名称", tigger: 'blur'}
          ]
        },
        //控制修改参数的对话框显示与隐藏
        editDialogVisible: false,
        //修改参数的表单数据
        editForm: {
          attr_name: '',
        },

      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const { data: res } = await getCateList_();
        if(res.meta.status !==200 ) return this.$message.error("获取分类列表失败!");

        this.cateList = res.data;
      },
      //级联选择框变动会触发
      handleChange() {
        this.getParamsData();
      },
      //tab页签点击事件的处理
      handleTabClick() {
        this.getParamsData();
      },
      //获取参数的列表数据
      async getParamsData() {
        const { data: res } = await getParamsData_(this.cateId, this.activeName);
        if(res.meta.status !==200 ) return this.$message.error("获取参数列表失败!");

        if(this.activeName === 'many') {
          this.manyTableData = res.data;
        }else {
          this.onlyTableData = res.data;
        }
      },
      //监听添加对话框的关闭事件
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      //添加参数或属性
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return;

          const queryInfo = {
            id: this.cateId,
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }

          const { data: res } = await addParams_(queryInfo);
          if(res.meta.status !==201 ) return this.$message.error("添加参数失败!");

          this.addDialogVisible = false;
          this.getParamsData();
        })
      },
      //监听修改对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      async showEditDiglog(attr_id) {

        //查询当前参数的信息
        const queryInfo = {
          id: this.cateId,
          attrId: attr_id,
          attr_sel: this.activeName
        }
        const { data: res } = await getParamsById_(queryInfo);
        if(res.meta.status !==200 ) return this.$message.error("获取当前参数失败!");

        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      //修改参数或属性
      async editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if(!valid) return;

          const queryInfo = {
            id: this.cateId,
            attrId: this.editForm.attr_id,
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
          console.log(queryInfo);
          const { data: res } = await editParams_(queryInfo);
          console.log(res);
          if(res.meta.status !==200 ) return this.$message.error("修改参数失败!");
          
          this.$message.success("修改参数成功!");
          this.getParamsData();
          this.editDialogVisible = false;
        })
      },
      //删除参数或属性
      async removeParams(attr_id) {
        //弹框询问是否删除
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== "confirm"){
          return this.$message.info("已取消删除!")
        }else{
          const queryInfo = {
            id: this.cateId,
            attrId: attr_id,
          }
          const { data: res } = await removeParams_(queryInfo);
          if(res.meta.status !==200 ) return this.$message.error("删除参数失败!");

          this.$message.success("删除参数成功!");
          this.getParamsData();
        }
      }
    },
    computed: {
      //是否禁用添加按钮
      idBtnDisabled() {
        return this.selectedCateKeys.length !== 3
      },
      //当前选中的三级分类的id
      cateId() {
        return this.selectedCateKeys[2];
      },
      titleText() {
        return this.activeName === 'many' ? '动态参数' : '静态属性';
      }
    }
  }
</script>

<style lang="less" scoped>
  .cat-opt {
    margin: 15px 0;
  }

  .el-cascader {
    width: 260px;
    margin-left: 10px;
  }
</style>