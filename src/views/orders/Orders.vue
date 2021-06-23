<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加、搜索商品 -->
      <el-row :gutter="10">
        <!-- 搜索商品 -->
        <el-col :span="8">
          <el-input v-model="queryInfo.query" 
          placeholder="请输入内容"
          clearable
          @clear="getOrderList">
            <el-button slot="append" 
            icon="el-icon-search"
            @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" ></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="110px"></el-table-column>
        <el-table-column label="是否付款" width="110px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'"
            type="success">已付款</el-tag>
            <el-tag v-else  type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="110px"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
           <template>
            <el-button type="primary" icon="el-icon-edit"  @click="showBox" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location" @click="showProgressBox" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[6, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
    
    <!-- 修改地址的对话框 -->
    <el-dialog
    title="修改地址"
    :visible.sync="addressVisible"
    @close="addressDiglogClosed"
    width="50%">
      <el-form :model="addressForm" 
      :rules="addressFormRules" 
      ref="addressFormRef" 
      label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
          v-model="addressForm.address1"
          :options="cityData"
          :props="{ expandTrigger: 'hover' }">
          </el-cascader>

        </el-form-item>
        <el-form-item label="详细地址" prop="address1">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流进度的对话框 -->
    <el-dialog
    title="物流进度"
    :visible.sync="progressVisible"
    width="50%">
      <el-timeline>
        <el-timeline-item
        v-for="(activity, index) in progressInfo"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
  import { getOrderList_, getProgressInfo_} from "api/orders"
  import cityData from "./citydata.js"
  import progressInfo from "./progressInfo.js"
  export default {
    name: "Orders",
    data() {
      return {
        //查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 6
        },
        //订单总数
        total: 0,
        //订单列表数据
        orderList: [],
        //修改地址的对话框显示与隐藏
        addressVisible: false,
        //修改地址的表单对象
        addressForm: {
          address1: [],
          address2: '',
        },
        addressFormRules: {
          address1: [
            {required: true, message: "请选择省市区/县", trigger: 'blur'}
          ],
          address2: [
            {required: true, message: "请输入详细地址", trigger: 'blur'}
          ]
        },
        //全国省市区数据
        cityData: cityData,
        //物流进度的对话框
        progressVisible: false,
        //物流信息
        progressInfo: progressInfo,
      }
    },
    created() {
      this.getOrderList();
    },
    methods: {
      //获得订单列表数据
      async getOrderList() {
        const { data: res } = await getOrderList_(this.queryInfo);
        if(res.meta.status !== 200) return this.$message.error("获取订单列表失败!")

        this.orderList = res.data.goods;
        this.total = res.data.total;
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      //展示修改地址的对话框
      showBox() {
        this.addressVisible = true;
      },
      addressDiglogClosed() {
        this.$refs.addressFormRef.resetFields();
      },
      async showProgressBox() {

        //接口失效
        // const { data: res } = await getProgressInfo_(1106975712662);
        // if(res.meta.status !== 200) return this.$message.error("获取物流信息失败!")
        // this.progressInfo = res.data;

        this.progressVisible = true;
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>