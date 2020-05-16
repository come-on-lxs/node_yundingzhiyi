<template>
  <div id="home" class="app-container">
    <div v-loading.fullscreen.lock="loadingFull" />
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="card-panel">
          <svg-icon icon-class="user_1" class-name="card-panel-icon" />
          <div class="card-panel-main">
            <span class="card-panel-text">英雄数量</span>
            <count-to :start-val="0" :end-val="info.hero" :duration="500" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card-panel">
          <svg-icon icon-class="race_1" class-name="card-panel-icon" />
          <div class="card-panel-main">
            <span class="card-panel-text">羁绊数量</span>
            <count-to :start-val="0" :end-val="info.race" :duration="500" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card-panel">
          <svg-icon icon-class="equip_1" class-name="card-panel-icon" />
          <div class="card-panel-main">
            <span class="card-panel-text">装备数量</span>
            <count-to :start-val="0" :end-val="info.equip" :duration="500" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// api
import { getInfo } from '@/api/home'
import CountTo from 'vue-count-to'
export default {
  components: { CountTo },
  data() {
    return {
      loadingFull: false,
      info: {}
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      this.loadingFull = true
      await getInfo().then(res => {
        this.loadingFull = false
        if (res.code === 200) {
          this.info = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.loadingFull = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  $bg: #eceef1;
  $white: #fff;
  #home {
    background: $bg;
    .card-panel {
      flex: 1;
      padding: 20px;
      background: $white;

      .card-panel-icon {
        width: 48px;
        height: 48px;
      }
      .card-panel-main {
        float: right;
        height: 48px;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0,0,0,0.45);
          font-size: 16px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>