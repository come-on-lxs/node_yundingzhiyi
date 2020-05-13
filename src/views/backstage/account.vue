<template>
  <div class="app-container">
    <div v-loading.fullscreen.lock="loadingFull" />
    <div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="dialog.account = true"
      >
        添加账户
      </el-button>
    </div>
    <el-table
      stripe
      border
      :header-cell-style="{ background: '#f8fbfc' }"
      class="table-container"
      :data="tableList"
    > 
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="desc"
        label="简介"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <el-tag slot-scope="{ row: { status } }" :type="status === '1' ? 'success' : 'danger'">{{ status === '1' ? '正常' : '禁用' }}</el-tag>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="{ row }">
          <el-tooltip v-if="row.status==='1'" class="item" effect="dark" content="禁用" placement="top">
            <i class="el-icon-lock control-icon"></i>
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="启用" placement="top">
            <i class="el-icon-unlock control-icon"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="top">
            <i class="el-icon-refresh control-icon"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改角色" placement="top">
            <i class="el-icon-guide control-icon"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-edit control-icon control-icon-success"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete control-icon control-icon-danger"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination :total="tableTotal" :limit="searchForm.page_size" :page="searchForm.page_index" @pagination="changePagination" @update:limit="changePagination" />
    <!-- 添加/修改 -->
    <el-dialog
      title="账户"
      :visible.sync="dialog.account"
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
// api
import { list } from '@/api/account'
export default {
  data() {
    return {
      dialog: {
        account: false
      },
      loadingFull: false,
      accountForm: {
        status: '',
        username: '',
        desc: ''
      },
      searchForm: {
        page_index: 1,
        page_size: 10
      },
      tableList: [],
      tableTotal: 0
    }
  },
  created() {
    this.list()
  },
  methods: {
    async list() {
      this.loadingFull = true
      await list(this.searchForm).then(res => {
        this.loadingFull = false
        if(res.code === 200) {
          this.tableList = res.data
          this.tableTotal = res.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.loadingFull = false
      })
    },
    // 分页页码变化
    changePagination(data) {
      const { page, limit } = data
      this.searchForm.page_size = limit
      this.searchForm.page_index = page
      this.list()
    }
  }
}
</script>
<style lang="scss">

</style>