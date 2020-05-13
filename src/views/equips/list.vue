<template>
  <div class="app-container" id="equips-container">
    <div v-loading.fullscreen.lock="loadingFull" />
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
    <el-table
      border
      stripe
      :header-cell-style="{ background: '#f8fbfc' }"
      :data="equipsList"
      class="table-container"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="imgUrl"
        label="装备图片"
        align="center"
        width="100"
      >
        <el-image
          slot-scope="{ row: { imgUrl } }"
          style="width: 40px; height: 40px"
          :src="imgUrl"
          fit="fill"
        />
      </el-table-column>
      <el-table-column
        prop="name"
        label="装备名称"
      />
      <el-table-column
        prop="desc"
        label="装备功能"
      />
      <el-table-column
        prop="type"
        label="装备类型"
      >
        <div slot-scope="{ row: { type, makes } }" class="makes-container">
          <el-tag :type="type === '0' ? 'success' : 'primary'">{{type === '0' ? '基础装备' : '合成装备'}}</el-tag>
          <el-image
            v-for="item in makes"
            :key="item._id"
            style="width: 40px; height: 40px"
            :src="item.imgUrl"
            fit="fill"
          />
        </div>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
      >
        <span slot-scope="{ row:{ create_time:time } }">{{ formattime(time) }}</span>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="equip_type ? '添加装备' : '修改装备'"
      :visible.sync="dialog_equip"
    >
      <el-form ref="equipsform" :model="equipsForm" :rules="equipsRules" label-width="100px">
        <el-form-item label="装备名称:" prop="name">
          <el-input v-model="equipsForm.name" type="text" />
        </el-form-item>
        <el-form-item label="装备功能:">
          <el-input v-model="equipsForm.desc" type="textarea" />
        </el-form-item>
        <el-form-item label="装备图标:">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadRaceImg"
            :show-file-list="false"
          >
            <img v-if="equipsForm.imgUrl" :src="equipsForm.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="装备类型:" prop="type">
          <el-select v-model="equipsForm.type" placeholder="请选择">
            <el-option label="基础装备" value="0" />
            <el-option label="合成装备" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="equipsForm.type === '1'" label="合成装备:" prop="makes">
          <el-checkbox-group v-model="equipsForm.makes">
            <el-checkbox v-for="item in makesList" :key="item.id" :label="item._id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetDialogEquips">取消</el-button>
          <el-button type="primary" @click="submitAdd">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <pagination :total="pageTotal" :limit="page_size" :page="page_index" @pagination="changePagination" @update:limit="changePagination" />
  </div>
</template>
<script>
// api
import { upload, add, list, getMakesList } from '@/api/equips'
import { formattime } from '@/utils/index'
export default {
  data() {
    const makesValidate = (rule, value, cb) => {
      if (this.equipsForm.type === '0') {
        cb()
      } else {
        if (value.length < 2 || value.length > 2) {
          return cb(new Error('合成装备由2个基础装备组成'))
        } else {
          cb()
        }
      }
    }
    return {
      loadingFull: false,
      dialog_equip: false,
      equip_type: true,
      equipsForm: {
        name: '',
        imgUrl: '',
        type: '0',
        makes: [],
        desc: ''
      },
      equipsRules: {
        name: [
          { required: true, message: '请填写装备名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择装备类型', trigger: 'change' }
        ],
        makes: [
          { validator: makesValidate, trigger: 'change' }
        ]
      },
      page_index: 1,
      page_size: 10,
      pageTotal: 0,
      equipsList: [],
      makesList: []
    }
  },
  watch: {
    dialog_equip(a,b) {
      if(a) {
        this.getMakesList()
      }
    }
  },
  created() {
    this.formattime = formattime
    this.getList()
  },
  methods: {
    async getList() {
      this.loadingFull = true
      await list({
        page_index: this.page_index,
        page_size: this.page_size
      }).then(res => {
        this.loadingFull = false
        if (res.code === 200) {
          this.equipsList = res.data
          this.pageTotal = res.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.loadingFull = false
      })
    },
    // 组成列表
    async getMakesList() {
      this.loadingFull = true
      await getMakesList().then(res => {
        this.loadingFull = false
        if (res.code === 200) {
          this.makesList = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.loadingFull = false
      })
    },
    // 上传图片
    uploadRaceImg(params,e) {
      const file = params.file,
      fileType = file.type,
      isImage = fileType.indexOf("image") != -1,
      isLt2M = file.size / 1024 / 1024 < 2;
      // 这里常规检验，看项目需求而定
      if (!isImage) {
        this.$message.error("只能上传图片格式png、jpg、gif!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("只能上传图片大小小于2M");
        return;
      }
      // 根据后台需求数据格式
      const form = new FormData();
      // 文件对象
      form.append("imgUrl", file);
      this.loadingFull = true
      upload(form).then(res => {
        this.loadingFull = false
        if(res.code === 200) {
            this.equipsForm.imgUrl = `http://${res.data}`
        } else {
          this.$message.error(res.message || '上传图片失败')
        }
      }).catch(e => {
        this.loadingFull = false
      })
    },
    // 重置
    resetDialogEquips() {
      this.equipsForm = {
        name: '',
        imgUrl: '',
        type: '0',
        makes: [],
        desc: ''
      }
      this.dialog_equip = false
      this.equip_type = true
    },
    // 添加
    submitAdd() {
      this.$refs.equipsform.validate((v) => {
        if (v) {
          if (!this.equipsForm.imgUrl) {
            this.$message.error('请上传装备图片')
          } else {
            this.loadingFull = true
            add(this.equipsForm).then(res => {
              this.loadingFull = false
              if (res.code === 200) {
                this.resetDialogEquips()
                this.getList()
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            }).catch(e => {
              this.loadingFull = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 分页页码变化
    changePagination(data) {
      const { page, limit } = data
      this.page_size = limit
      this.page_index = page
      this.getList()
    }
  }
}
</script>
<style lang="scss">
  #equips-container {
    .makes-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .el-image {
        margin-left: 15px;
      }
    }
  }
</style>