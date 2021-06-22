<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form :model="addForm" 
      :rules="addFormRules" 
      ref="addFormRef" 
      label-width="100px" 
      label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" > 
              <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="catePorps"
              @change="handleCascaderChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { getCateList_ } from "api/goods"
  export default {
    name: "Add",
    data() {
      return {
        activeIndex: '0',
        // 添加商品的表单对象
        addForm: {
          goods_name: '',
          goods_price: null,
          goods_number: null,
          goods_weight: null,
          goods_cat: [],
        },
        addFormRules: {
          goods_name: [{required: true, message: "请输入商品名称", tigger: "blur"}],
          goods_price: [{required: true, message: "请输入商品价格", tigger: "blur"}],
          goods_number: [{required: true, message: "请输入商品数量", tigger: "blur"}],
          goods_weight: [{required: true, message: "请输入商品重量", tigger: "blur"}],
          goods_cat: [{required: true, message: "请输入商品分类", tigger: "blur"}],
        },
        //商品分类列表
        cateList: [],
        //级联选择器的设置
        catePorps: {
          label: "cat_name",
          value: "cat_id",
          children: "children",
          expandTrigger: 'hover'
        }
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      async getCateList() {
        const { data: res } = await getCateList_();
        console.log(res);
        if(res.meta.status !==200 ) return this.$message.error("获取商品分类数据失败!");

        this.cateList = res.data;
      },
      //监听级联选择器变化
      handleCascaderChange() {
        if(this.addForm.goods_cat.length !== 3 ) {
          this.addForm.goods_cat= [];
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>