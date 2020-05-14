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
            <i class="el-icon-lock control-icon" @click="handleChangeStatus(row)"></i>
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="启用" placement="top">
            <i class="el-icon-unlock control-icon" @click="handleChangeStatus(row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改密码" placement="top">
            <i class="el-icon-refresh control-icon control-icon-success" @click="handleResetPwd(row)"></i>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="修改角色" placement="top">
            <i class="el-icon-guide control-icon"></i>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-edit control-icon control-icon-success" @click="handleEdit(row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete control-icon control-icon-danger" @click="handleDelete(row)"></i>
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
      :close-on-click-modal="false"
    >
      <el-form ref="accountform" label-width="100px" :model="accountForm" :rules="accountRules">
        <el-form-item label="账户名:" prop="username">
          <el-input v-model="accountForm.username" type="text" placeholder="账户名" />
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model="accountForm.desc" type="textarea" placeholder="简介" />
        </el-form-item>
        <el-form-item label="是否启用:" prop="status">
          <el-radio-group v-model="accountForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="resetDialogAccount">取消</el-button>
          <el-button v-if="edit.accountType" type="primary" size="small" @click="submitAdd">添加</el-button>
          <el-button v-else type="primary" size="small" @click="submitEdit">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="dialog.password"
      :close-on-click-modal="true"
      width="520px"
    >
      <el-input v-model="resetpwd.val" type="text" placeholder="请输入新密码" class="mgbtm15" />
      <el-button size="small" @click="resetDialogPwd">取消</el-button>
      <el-button size="small" type="primary" @click="submitResetPwd">修改</el-button>
    </el-dialog>
  </div>
</template>
<script>
// api
import { list, add, toDelete, toResetPwd, changeStatus, toEdit } from '@/api/account'
export default {
  data() {
    return {
      dialog: {
        account: false,
        password: false
      },
      loadingFull: false,
      accountForm: {
        status: '',
        username: '',
        desc: ''
      },
      accountRules: {
        username: [
          { required: true, message: '请填写账户名', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择账户状态', trigger: 'change' }
        ]
      },
      searchForm: {
        page_index: 1,
        page_size: 10
      },
      tableList: [],
      tableTotal: 0,
      resetpwd: {
        id: '',
        val: ''
      },
      edit: {
        accountType: '',
        accountId: ''
      }
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
    },
    resetDialogAccount() {
      this.accountForm = {
        status: '',
        username: '',
        desc: ''
      }
      this.dialog.account = false
      this.edit.accountType = false
      this.edit.accountId = ''
    },
    submitAdd() {
      this.$refs.accountform.validate((valid) => {
        if(valid) {
          this.loadingFull = true
          add(this.accountForm).then(res => {
            this.loadingFull = false
            if(res.code === 200) {
              this.resetDialogAccount()
              this.list()
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          }).catch(e => {
            this.loadingFull = false
          })
        } else {
          return false
        }
      })
    },
    handleDelete(row) {
      this.$confirm('删除账户不可找回,是否要删除该账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingFull = true
        toDelete({
          id: row._id
        }).then(res => {
          this.loadingFull = false
          if(res.code === 200) {
            this.list()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.loadingFull = false
        })
      })
    },
    handleResetPwd(row) {
      this.resetpwd.id = row._id
      this.dialog.password = true
    },
    resetDialogPwd() {
      this.resetpwd = {
        id: '',
        val: ''
      }
      this.dialog.password = false
    },
    async submitResetPwd() {
      let { id, val:password } = this.resetpwd
      if(!password) {
        this.$message.error('修改的密码不能为空')
      } else if (password.length < 6) {
        this.$message.error('修改的密码至少为6个字符')
      } else {
        this.loadingFull = true
        await toResetPwd({
          id,
          password
        }).then(res => {
          this.loadingFull = false
          if(res.code === 200) {
            this.resetDialogPwd()
            this.list()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.loadingFull = false
        })
      }
    },
    // 修改状态
    handleChangeStatus(row) {
      this.loadingFull = true
      changeStatus({
        id: row._id,
        status: row.status === '0' ? '1' : '0'
      }).then(res => {
        this.loadingFull = false
        if(res.code === 200) {
          this.list()
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.loadingFull = false
      })
    },
    handleEdit(row) {
      this.edit.accountType = false
      this.edit.accountId = row._id
      this.accountForm.status = Number(row.status)
      this.accountForm.desc = row.desc
      this.accountForm.username = row.username
      this.dialog.account = true
    },
    submitEdit() {
      this.$refs.accountform.validate((valid) => {
        if(valid) {
          this.loadingFull = true
          let data = Object.assign({}, this.accountForm)
          data.id = this.edit.accountId
          toEdit(data).then(res => {
            this.loadingFull = false
            if(res.code === 200) {
              this.resetDialogAccount()
              this.list()
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          }).catch(e => {
            this.loadingFull = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">

</style>