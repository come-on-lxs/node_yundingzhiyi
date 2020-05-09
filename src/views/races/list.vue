<template>
  <div class="app-container">
    <div>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="dialog_race = true; type_race = true;"
      >
        添加羁绊
      </el-button>
    </div>

    <el-table
      :data="raceList"
      border
      stripe
      class="table-container"
    >
      <el-table-column
        prop="imgUrl"
        label="羁绊图标"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.imgUrl"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="羁绊名称"
        align="center"
        width="180"
      />
      <el-table-column
        prop="content"
        label="羁绊效果"
        align="center"
      />
      <el-table-column
        prop="status"
        label="是否使用"
        align="center"
        width="100"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">{{row.status === '1' ? '已启用' : '已禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="添加时间"
        align="center"
        width="200"
      >
        <template slot-scope="{ row }">
          {{ formattime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180"
      >
        <template slot-scope="{ row }">
          <el-tooltip v-if="row.status==='1'" class="item" effect="dark" content="禁用" placement="top">
            <i class="el-icon-lock control-icon" @click="change(row)"></i>
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="启用" placement="top">
            <i class="el-icon-unlock control-icon" @click="change(row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-edit control-icon control-icon-success" @click="handleEdit(row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete control-icon control-icon-danger" @click="deleteRace(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="type_race ? '添加羁绊':'修改羁绊'"
      :visible.sync="dialog_race"
      :close-on-click-modal="false"
      :before-close="resetRaceForm"
    >
      <el-form label-width="100px" :model="raceForm" ref="raceform" :rules="raceRules">
        <el-form-item label="羁绊名称:" prop="name">
          <el-input type="text" placeholder="羁绊名称" v-model="raceForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图标:">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="uploadRaceImg"
            :show-file-list="false"
          >
            <img v-if="raceForm.imgUrl" :src="raceForm.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="羁绊效果:" prop="content">
          <el-input type="textarea" placeholder="羁绊效果" v-model="raceForm.content"></el-input>
        </el-form-item>
        <el-form-item label="是否使用:" prop="status">
          <el-radio-group v-model="raceForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="dialog_race = false">取消</el-button>
          <el-button v-if="type_race" type="primary" size="small" @click="addSubmit">添加</el-button>
          <el-button v-else type="primary" size="small" @click="editSubmit">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// api
import { upload, add, list, remove, edit, changeStatus } from '@/api/races'
// 格式化时间
import { formattime } from '@/utils/index'
export default {
  data() {
    return {
      dialog_race: false,
      type_race: true,
      uploadHeader: {
        authorization: localStorage.getItem('token')
      },
      raceForm: {
        imgUrl: '',
        name: '',
        content: '',
        status: ''
      },
      raceRules: {
        name: [
          { required: true, message: '请填写羁绊名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写羁绊效果', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
      },
      raceList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      list().then(res => {
        if(res.code === 200) {
          this.raceList = res.data
        }
      })
    },
    // 上传图片
    uploadRaceImg(params) {
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
      form.append("raceImg", file);
      upload(form).then(res => {
        if(res.code === 200) {
          this.raceForm.imgUrl = `http://${res.data}`
        } else {
          this.$message.error(res.message || '上传图片失败')
        }
      })
    },
    // 添加
    addSubmit() {
      this.$refs.raceform.validate((valid) => {
        if (valid) {
          if(!this.raceForm.imgUrl) {
            this.$message.error('请上传图标')
            return false;
          }
          add(this.raceForm).then(res => {
            if(res.code === 200) {
              this.resetRaceForm()
              this.getList()
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message || '添加失败')
            }
          })
        } else {
          return false;
        }
      });
    },
    // 重置添加
    resetRaceForm() {
      this.$refs.raceform.resetFields();
      this.raceForm = {
        imgUrl: '',
        name: '',
        content: '',
        status: ''
      }
      this.dialog_race = false;
    },
    // 格式化时间
    formattime(time) {
      return formattime(time, 'yyyy-MM-dd hh:mm:ss')
    },
    // 删除
    deleteRace(row) {
      let { _id } = row
      remove({
        id: _id
      }).then(res => {
        if(res.code === 200) {
          this.getList()
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 修改
    handleEdit(row) {
      row.status = Number(row.status)
      this.raceForm = Object.assign({}, row)
      this.type_race = false
      this.dialog_race = true
    },
    // 提交修改
    editSubmit() {
      this.$refs.raceform.validate((valid) => {
        if (valid) {
          if(!this.raceForm.imgUrl) {
            this.$message.error('请上传图标')
            return false;
          }
          edit(this.raceForm).then(res => {
            if(res.code === 200) {
              this.resetRaceForm()
              this.getList()
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message || '修改失败')
            }
          })
        } else {
          return false;
        }
      });
    },
    // 禁用启用
    change(row) {
      let { _id, status } = row
      changeStatus({
        id: _id,
        status: status === '0' ? '1' : '0'
      }).then(res => {
        if(res.code === 200) {
          this.getList()
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message || '修改失败')
        }
      })
    }
  }
}
</script>
