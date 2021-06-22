<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加、搜索商品 -->
      <el-row :gutter="10">
        <!-- 搜索商品 -->
        <el-col :span="8">
          <el-input v-model="queryInfo.query" 
          placeholder="请输入内容"
          clearable
          @clear="getGoodsList">
            <el-button slot="append" 
            icon="el-icon-search"
            @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name"  label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="105px"> </el-table-column>
        <el-table-column prop="goods_number" label="商品数量"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"> 
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger"  size="mini" 
             icon="el-icon-delete"
             @click="removeGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
  import { getGoodsList_, removeGoodsById_ } from "api/goods"
  export default {
    name: "List",
    data() {
      return {
        //查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        //商品列表
        goodsList: [],
        //商品总数
        total: 0,
      }
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      //获得商品列表
      async getGoodsList() {
        const { data: res } = await getGoodsList_(this.queryInfo);
        if(res.meta.status !== 200) return this.$message.error("获取商品列表失败!");

        this.$message.success("获取参数列表成功!");
        this.goodsList = res.data.goods;
        this.total = res.data.total;
      },
      //监听每页显示数量改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      //监听当前页码改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      //删除商品
      async removeGoodsById(id) {
        const confrimResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confrimResult !== "confirm") {
          return this.$message.info("已取消删除!");
        }

        const { data: res } = await removeGoodsById_(id);
        if(res.meta.status !== 200 ) return this.$message.error("删除商品失败!");

        this.$message.success("删除商品成功!");
        this.getGoodsList();
      },
      goAddPage() {
        this.$router.push('/goods/add');
      }
    }
  }
</script>

<style lang="less" scoped>

</style>