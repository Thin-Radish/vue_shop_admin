<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary"
      @click="showAddcateDiglog">添加分类</el-button>

      <!-- 表格 -->
      <tree-table :data="cateList"
      class="tree-table"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      :show-row-hover="false"
      index-text="#" border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success"  style="color: lightgreen"
          v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color:red" v-else ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level ===0 ">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level ===1 ">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template  slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>

      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      width="40%"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogcolsed">
      <!-- 添加分类表单 -->
      <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules">
        <el-form-item label="分类名称:" prop="cat_name" label-width="100px">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" label-width="100px">
          <!-- 级联选择器中options为数据源 -->
          <el-cascader
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cascaderProps"
          @change="parentCateChanged"
          expand-trigger="hover"
          clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import { getCateList_, addCate_ } from "api/goods"
  export default {
    name: "Category",
    data() {
      return {
        //商品分类数据
        cateList: [],
        // 查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        //为table指定列的定义
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            //表示当前定义为模板列
            type: 'template',
            //表示当前这一列使用的模板名称
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          }
        ],
        //控制添加分类对话框的显示与隐藏
        addCateDialogVisible : false,
        //添加分类的表单数据项
        addCateForm: {
          //分类的名称
          cat_name: '',
          //分类的等级，默认为一级
          cat_level: 0,
          //父级分类的id
          cat_pid: 0,
        },
        //添加分类的表单验证规则
        addCateFormRules: {
          cat_name: [
            {required: true, message: "请输入分类名称", trigger: 'blur'}
          ]
        },
        //父级分类的列表
        parentCateList: [],
        //指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          expandTrigger: 'hover',
          checkStrictly: true
        },
        //选中的父级分类的id数组
        selectedKeys: [],
      }
    },
    created() {
      //获取分类列表
      this.getCateList();
    },
    methods: {
      async getCateList() {
        const { data: res } = await getCateList_(this.queryInfo);
        if(res.meta.status !==200 ) return this.$message.error("获取分类列表失败!");

        this.cateList = res.data.result;
        //总数据条数赋值
        this.total = res.data.total;
      },
      //监听pagesize变化事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getCateList();
      },
      //监听页码值改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getCateList();
      },
      //显示添加分类对话框
      showAddcateDiglog() {
        //先获取父级分类数据
        this.getParentCateList();
        //再弹出对话框
        this.addCateDialogVisible = true;
      },
      //获取父级分类数据
      async getParentCateList() {
        const { data: res } = await getCateList_({type: 2});
        if(res.meta.status !==200 ) return this.$message.error("获取父级分类数据失败!");

        this.parentCateList = res.data;
      },
      //选择项发送变化触发
      parentCateChanged() {
        //如果selectedKeys的长度不为0，则说明选择了父级分类
        //反之，则没有选中父级分类
        if(this.selectedKeys.length > 0) {
          //数组的最后一项就为父级分类的id
          this.addCateForm.cat_pid = this.selectedKeys[ this.selectedKeys.length -1];

          //为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length;
          return;
        }else {
          //当前为一级分类
          this.addCateForm.cat_pid = 0;
          this.addCateForm.cat_level = 0;
        }
      },
      //添加分类
      async addCate() {
        this.$refs.addCateFormRef.validate( async valid => {
          if(!valid) return;

          const { data: res } = await addCate_(this.addCateForm);
          if(res.meta.status !== 201) return this.$message.error("添加分类失败!");

          this.$message.success("添加分类成功!");
          this.addCateDialogVisible = false;
          this.getCateList();
        })
      },
      addCateDialogcolsed() {
        this.$refs.addCateFormRef.resetFields();
        this.selectedKeys = [];
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }

    }, 
  }
</script>

<style lang="less" scoped>
  .tree-table {
    margin-top: 15px;
    min-width: 800px;
  }
  
</style>