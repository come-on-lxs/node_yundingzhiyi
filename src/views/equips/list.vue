<template>
  <div class="app-container">
    <div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="dialog_equip = true"
      >
        添加装备
      </el-button>
    </div>
    
    <el-dialog
      :title="equip_type ? '添加装备' : '修改装备'"
      :visible.sync="dialog_equip"
    >
    </el-dialog>
  </div>
</template>
<script>

export default {
  data() {
    return {
      dialog_equip: true,
      equip_type: true
    }
  },
  methods: {
    
  }
}
</script>
<style lang="scss">

</style>