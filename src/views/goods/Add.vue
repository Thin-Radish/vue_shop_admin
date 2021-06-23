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
        <el-tabs :tab-position="'left'" 
        v-model="activeIndex"
        :before-leave="beforeTabLeave"
        @tab-click="tabClicked">
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
              @change="handleCascaderChange"
              @tab-click="tabClicked">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item v-for="item in manyTableData" 
            :key="item.attr_id"
            :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" 
                :key="i"
                border
                :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的item项 -->
            <el-form-item v-for="item in onlyTableData" 
            :key="item.attr_id"
            :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj"
            :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor
            v-model="addForm.goods_introduce">
            </quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
  import { getCateList_, addGoods_ } from "api/goods"
  import { getParamsData_ } from "api/params"
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
          pics: [],
          goods_introduce: '',
          attrs: [],
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
        },
        //动态参数列表数据
        manyTableData: [],
        //静态属性列表数据
        onlyTableData: [],
        //上传图片的URL地址
        uploadURL:"http://127.0.0.1:8888/api/private/v1/upload",
        headersObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        //预览图片的路径
        previewPath: '',
        //图片预览对话框
        previewVisible: false,
      }
    },
    created() {
      this.getCateList();
    },
    methods: {
      async getCateList() {
        const { data: res } = await getCateList_();
        if(res.meta.status !==200 ) return this.$message.error("获取商品分类数据失败!");

        this.cateList = res.data;
      },
      //监听级联选择器变化
      handleCascaderChange() {
        if(this.addForm.goods_cat.length !== 3 ) {
          this.addForm.goods_cat= [];
        }
      },
      //当tab栏发生跳转时
      beforeTabLeave(activeName, oldActiveName) {
        if(this.addForm.goods_cat.length !==3 && oldActiveName === '0') {
          this.$message.error("请选择商品分类!");
          return false;
        }
      },
      //当tab栏被点击时
      async tabClicked() {
        if(this.activeIndex === '1') {
          const { data: res } = await getParamsData_(this.cateId, 'many');
          if(res.meta.status !==200 ) return this.$message.error("获取动态参数列表失败!");

          //整理提取参数标签的数据
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
          });
          this.manyTableData = res.data;

        } else if(this.activeIndex === '2') {
          const { data: res } = await getParamsData_(this.cateId, 'only');
          if(res.meta.status !==200 ) return this.$message.error("获取静态属性失败!");

          this.onlyTableData = res.data;
        }
      },
      //监听图片预览事件
      handlePreview(file) {
        this.previewPath = file.response.data.url;
        this.previewVisible = true;
      },
      //监听移除图片的操作
      handleRemove(file) {

        //1.获取将要删除的临时路径
        const filePath = file.response.data.tmp_path;

        //2.从pics数组中，找到这个图片的索引值
        const i = this.addForm.pics.findIndex(x => x.pic === filePath)

        //3.调用数组的splice方法，移除删除图片的图片信息对象
        this.addForm.pics.splice(i, 1);
      },
      //监听图片上传成功的事件
      handleSuccess(response) {
        //1.得到图片信息对象
        const picInfo = {
          pic: response.data.tmp_path
        }
        //2.讲图片信息对象push到表单pics中
        this.addForm.pics.push(picInfo)
      },
      //添加商品
      add() {
        this.$refs.addFormRef.validate(async valid => {
          if(!valid) return this.$message.error("请填写必要的表单项!");

          const form = JSON.parse(JSON.stringify(this.addForm));
          form.goods_cat = form.goods_cat.join(',');

          //处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(','),
            }
            form.attrs.push(newInfo);
          })
          //处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            form.attrs.push(newInfo);
          })

          const { data: res } = await addGoods_(form);
          if(res.meta.status !==201 ) return this.$message.error("添加商品失败!");

          this.$router.push("/goods");
          this.$message.success("添加商品成功!");
        })
      }
    },
    computed: {
      //获取三级分类的id
      cateId() {
        if(this.addForm.goods_cat.length ===3) {  
          return this.addForm.goods_cat[2];
        }
        return null;
      }
    }
  }
</script>

<style lang="less" scoped>

  .el-cascader {
    width: 250px;
  }

  .el-checkbox {
    margin: 0 10px 0 0!important;
  }

  .preview-img {
    width: 100%;
  }

  .addBtn {
    margin-top: 10px;
  }
</style>