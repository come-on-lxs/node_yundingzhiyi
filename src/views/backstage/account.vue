<template>
  <div class="app-container">
    <div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
      >
        添加账户
      </el-button>
    </div>

    <el-dialog
      title="账户"
      :visible.sync="dialog_account"
      :close-on-click-modal="true"
    >
      <el-form label-width="80px" :model="accountForm">
        <el-form-item label="账户名:" v-model="accountForm.username">
          <el-input type="text" placeholder="账户名"></el-input>
        </el-form-item>
        <el-form-item label="备注:" v-model="accountForm.desc">
          <el-input type="textarea" placeholder="简介"></el-input>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-radio-group v-model="accountForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog_account: true,
      accountForm: {
        status: '',
        username: '',
        desc: ''
      }
    }
  }
}
</script>
<style lang="scss">

</style>