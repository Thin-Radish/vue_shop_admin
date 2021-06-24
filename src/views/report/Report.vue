<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 2.为echarts准备一个容器 -->
      <div id="main" style="width: 1000px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
 //1.导入echarts
  import * as echarts from 'echarts'
  import { getReportData_ } from 'api/report'
  //需要合并的对象
  import options from 'assets/data/options.json'
  export default {
    name: "Report",
    async mounted() {
      // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 4.指定图表的配置项和数据
        const { data: res } = await getReportData_();
        if(res.meta.status !== 200) return this.$message.error("获取折线图数据失败!")
        //echarts配置对象合并
        const result = Object.assign(options,res.data)

        // 5.使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },
  }
</script>

<style lang="less" scoped>

</style>