<template>
  <div class="app-container" id="hero-container">
    <div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="dialog_hero = true; hero_type = true"
      >
        添加英雄
      </el-button>
    </div>
    <el-table
      :data="heroList"
      stripe
      border
      class="table-container"
    >
      <el-table-column
        prop="heroImg"
        label="英雄头像"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <el-image
            style="width: 60px; height: 60px"
            :src="row.heroImg"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      />
      <el-table-column
        prop="cost"
        label="费用"
        align="center"
      />
      <el-table-column
        prop="skill_name"
        label="技能名称"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="seeSkillInfo(row)">{{ row.skill_name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="羁绊"
        label="种族"
        align="center"
        width="300"
      >
        <template slot-scope="{ row }">
          <el-collapse accordion>
            <el-collapse-item v-for="item in row.races" :key="item._id">
              <template slot="title">
                <el-image
                  class="race-icon"
                  :src="item.imgUrl"
                  fit="fill"
                />
                {{ item.name }}
              </template>
              <div>{{ item.content }}</div>
            </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
      <el-table-column
        prop="attr"
        label="基础属性"
        align="center"
        width="450"
      >
        <template slot-scope="{ row }">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(value, key) of row.attr" :key="key" class="attr-container">
              <label class="attr-key">{{ key }}</label>
              <label>:</label>
              <label class="attr-value">{{ value }}</label>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
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
        label="操作"
        align="center"
        width="180"
      >
        <template slot-scope="{ row }">
          <el-tooltip v-if="row.status==='1'" class="item" effect="dark" content="禁用" placement="top">
            <i class="el-icon-lock control-icon" @click="changeHeroStatus(row)"></i>
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="启用" placement="top">
            <i class="el-icon-unlock control-icon" @click="changeHeroStatus(row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-edit control-icon control-icon-success" @click="editHero(row)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete control-icon control-icon-danger" @click="deleteHero(row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="hero_type ? '添加英雄':'修改英雄'"
      :visible.sync="dialog_hero"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="100px"
        :model="heroforms"
        ref="heroForm"
        :rules="heroRules"
      > 
        <el-form-item label="英雄名称:" prop="name">
          <el-input type="text" placeholder="英雄名称" v-model="heroforms.name" ></el-input>
        </el-form-item>
        <el-form-item label="英雄图标:">
          <el-upload
            class="avatar-uploader"
            action=""
            :data="{'type': 1}"
            :http-request="uploadRaceImg"
            :show-file-list="false"
          >
            <img v-if="heroforms.heroImg" :src="heroforms.heroImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="技能名称:" prop="skill_name">
          <el-input type="text" placeholder="技能名称" v-model="heroforms.skill_name"></el-input>
        </el-form-item>
        <el-form-item label="技能类型:" prop="skill_type">
          <el-select v-model="heroforms.skill_type" placeholder="请选择技能类型">
            <el-option :value="1" label="主动"></el-option>
            <el-option :value="0" label="被动"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技能效果:" prop="skill_content">
          <el-input type="textarea" placeholder="技能效果" v-model="heroforms.skill_content"></el-input>
        </el-form-item>
        <el-form-item label="技能图标:">
          <el-upload
            class="avatar-uploader"
            action=""
            :data="{'type': 2}"
            :http-request="uploadRaceImg"
            :show-file-list="false"
          >
            <img v-if="heroforms.skillImg" :src="heroforms.skillImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="英雄费用:" prop="cost">
          <el-input type="text" placeholder="费用" v-model="heroforms.cost"></el-input>
        </el-form-item>
        <el-form-item label="羁绊:" prop="races">
          <el-checkbox-group v-model="heroforms.races">
            <el-checkbox v-for="item in racesList" :key="item._id" :label="item._id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="英雄属性:">
          <div class="attr-list">
            <el-form-item class="attr-item" label="生命" prop="attr.生命">
              <input type="text" v-model="heroforms.attr.生命" />
            </el-form-item>
            <el-form-item class="attr-item" label="魔法" prop="attr.魔法">
              <input type="text" v-model="heroforms.attr.魔法" />
            </el-form-item>
            <el-form-item class="attr-item" label="护甲" prop="attr.护甲">
              <input type="text" v-model="heroforms.attr.护甲" />
            </el-form-item>
            <el-form-item class="attr-item" label="魔抗" prop="attr.魔抗">
              <input type="text" v-model="heroforms.attr.魔抗" />
            </el-form-item>
            <el-form-item class="attr-item" label="物攻" prop="attr.物攻">
              <input type="text" v-model="heroforms.attr.物攻" />
            </el-form-item>
            <el-form-item class="attr-item" label="攻速" prop="attr.攻速">
              <input type="text" v-model="heroforms.attr.攻速" />
            </el-form-item>
            <el-form-item class="attr-item" label="射程" prop="attr.射程">
              <input type="text" v-model="heroforms.attr.射程" />
            </el-form-item>
            <el-form-item class="attr-item" label="暴击" prop="attr.暴击">
              <input type="text" v-model="heroforms.attr.暴击" />
            </el-form-item>
            <el-form-item class="attr-item" label="初始魔法" prop="attr.初始魔法">
              <input type="text" v-model="heroforms.attr.初始魔法" />
            </el-form-item>
            <el-form-item class="attr-item" label="暴击伤害" prop="attr.暴击伤害">
              <input type="text" v-model="heroforms.attr.暴击伤害" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="是否使用:" prop="status">
          <el-radio-group v-model="heroforms.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="dialog_hero = false">取消</el-button>
          <el-button v-if="hero_type" type="primary" size="small" @click="addSubmit">添加</el-button>
          <el-button v-else type="primary" size="small" @click="editSubmit">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="skillInfo.name"
      :visible.sync="dialog_skill"
      :before-close="resetSkillInfo"
    >
      <div class="skillinfo-container">
        <el-image
          style="width: 100px; height: 100px"
          :src="skillInfo.skillImg"
          fit="fill"
        />
        <div class="skill-name-type">
          <div class="header">
            <div class="name">{{skillInfo.skill_name}}</div>
            <div class="type">
              <el-tag :type="skillInfo.skill_type === '1' ? 'success' : 'danger'">{{skillInfo.skill_type === '1' ? '主动技能' : '被动技能'}}</el-tag>
            </div>
          </div>
          <div class="desc">{{ skillInfo.skill_content }}</div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
// 羁绊api
import { list as raceList } from '@/api/races'
// 英雄api
import { upload, add, list, remove, edit, changeStatus } from '@/api/hero'

export default {
  data() {
    return {
      dialog_hero: false,
      hero_type: true,
      heroforms: {
        races: [],
        heroImg: '',
        skillImg: '',
        name: '',
        skill_name: '',
        skill_type: '',
        skill_content: '',
        cost: '',
        attr: {
          '生命': '',
          '魔法': '',
          '护甲': '', 
          '魔抗': '',
          '物攻': '',
          '攻速': '',
          '射程': '',
          '暴击': '',
          '初始魔法': '',
          '暴击伤害': ''
        },
        status: ''
      },
      racesList: [],
      heroRules: {
        name: [
          { required: true, message: '请输入英雄名称', trigger: 'blur' }
        ],
        skill_name: [
          { required: true, message: '请输入英雄技能', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入英雄费用', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择是否使用', trigger: 'change' }
        ],
        'attr.生命': [
          { required: true, message: '请输入英雄生命值', trigger: 'blur' }
        ],
        'attr.魔法': [
          { required: true, message: '请输入英雄魔法值', trigger: 'blur' }
        ],
        'attr.护甲': [
          { required: true, message: '请输入英雄护甲值', trigger: 'blur' }
        ],
        'attr.魔抗': [
          { required: true, message: '请输入英雄魔抗值', trigger: 'blur' }
        ],
        'attr.物攻': [
          { required: true, message: '请输入英雄物理攻击力', trigger: 'blur' }
        ],
        'attr.攻速': [
          { required: true, message: '请输入英雄攻击速度', trigger: 'blur' }
        ],
        'attr.射程': [
          { required: true, message: '请输入英雄射程', trigger: 'blur' }
        ],
        'attr.暴击': [
          { required: true, message: '请输入英雄暴击值', trigger: 'blur' }
        ],
        'attr.初始魔法': [
          { required: true, message: '请输入英雄初始魔法值', trigger: 'blur' }
        ],
        'attr.暴击伤害': [
          { required: true, message: '请输入英雄暴击伤害', trigger: 'blur' }
        ],
        races: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        skill_type: [
          { required: true, message: '请选择技能类型', trigger: 'change' }
        ],
        skill_content: [
          { required: true, message: '请输入技能效果', trigger: 'blur' }
        ]
      },
      heroList: [],
      dialog_skill: false,
      skillInfo: {}
    }
  },
  created() {
    this.getRaceList()
    this.getHeroList()
  },
  methods: {
    // 获取羁绊
    getRaceList() {
      raceList().then(res => {
        if(res.code === 200) {
          this.racesList = res.data
        }
      })
    },
    // 获取英雄
    getHeroList() {
      list().then(res => {
        if(res.code === 200) {
          this.heroList = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 上传图片
    uploadRaceImg(params,e) {
      const type = params.data.type
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
      form.append("heroImg", file);
      upload(form).then(res => {
        if(res.code === 200) {
          if(type === 1) {
            this.heroforms.heroImg = `http://${res.data}`
          } else {
            this.heroforms.skillImg = `http://${res.data}`
          }
        } else {
          this.$message.error(res.message || '上传图片失败')
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 添加
    addSubmit() {
      this.$refs.heroForm.validate((valid) => {
        if (valid) {
          if(!this.heroforms.heroImg) {
            this.$message.error('请上传英雄图标')
          } else if(!this.heroforms.skillImg) {
            this.$message.error('请上传技能图标')
          } else {
            add(this.heroforms).then(res => {
              if(res.code === 200) {
                this.resetHeroForm()
                this.getHeroList()
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            }).catch(e => {
              console.log(e)
            })
          }
        } else {
          return false;
        }
      });
    },
    // 重置弹窗
    resetHeroForm() {
      this.$refs.heroForm.resetFields()
      this.hero_type = true
      this.heroforms={
        races: [],
        heroImg: '',
        skillImg: '',
        name: '',
        skill_name: '',
        skill_type: '',
        skill_content: '',
        cost: '',
        attr: {
          '生命': '',
          '魔法': '',
          '护甲': '', 
          '魔抗': '',
          '物攻': '',
          '攻速': '',
          '射程': '',
          '暴击': '',
          '初始魔法': '',
          '暴击伤害': ''
        },
        status: ''
      }
      this.dialog_hero = false
    },
    // 查看技能
    seeSkillInfo(row) {
      this.skillInfo = row
      this.dialog_skill = true
    },
    // 重置查看技能
    resetSkillInfo() {
      this.dialog_skill = false
      this.skillInfo = {}
    },
    // 删除英雄
    deleteHero(row) {
      this.$confirm('删除英雄后将无法找回,是否还要继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { _id } = row
        remove({
          id: _id
        }).then(res => {
          if(res.code === 200) {
            this.getHeroList()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          console.log(e)
        })
      }).catch(e=>{})
    },
    // 编辑
    editHero(row) {
      this.heroforms = Object.assign({}, row)
      this.heroforms.status = Number(this.heroforms.status)
      this.heroforms.skill_type = Number(this.heroforms.skill_type)
      let races = []
      this.heroforms.races.map(item => {
        races.push(item._id)
      })
      this.heroforms.races = races
      this.hero_type = false
      this.dialog_hero = true
    },
    // 提交修改
    editSubmit() {
      this.$refs.heroForm.validate((valid) => {
        if (valid) {
          if(!this.heroforms.heroImg) {
            this.$message.error('请上传英雄图标')
          } else if(!this.heroforms.skillImg) {
            this.$message.error('请上传技能图标')
          } else {
            edit(this.heroforms).then(res => {
              if(res.code === 200) {
                this.resetHeroForm()
                this.getHeroList()
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            }).catch(e => {
              console.log(e)
            })
          }
        } else {
          return false;
        }
      });
    },
    // 禁用/启用
    changeHeroStatus(row) {
      let { _id, status } = row
      changeStatus({
        id: _id,
        status
      }).then(res => {
        if(res.code === 200) {
          this.$message.success(res.message)
          this.getHeroList()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss">
  #hero-container {
    .attr-list {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      .attr-item {
        margin-right: 30px;
        margin-bottom: 20px;

        label {
          display: inline-block;
          width: 65px;
          text-align: right;
          color: #606266;
          font-weight: 500;
        }

        input {
          width: 120px;
        }
      }
    }

    .race-icon {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }

    .el-collapse {
      border: none;
    }
    .el-collapse-item__header{
      height: 40px;
      line-height: 40px;
    }
    .el-collapse-item__header, .el-collapse-item__wrap {
      background: none;
      text-align: left;
    }

    .attr-container {
      display: flex;
      align-items: center;
      justify-content: center;
      .attr-key {
        display: inline-block;
        width: 60px;
        text-align: right;
      }
      .attr-value{
        display: inline-block;
        width: calc(100% - 65px);
        padding-left: 10px;
        text-align: left;
      }
    }

    .skillinfo-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .skill-name-type {
        width: calc(100% - 110px);
        display: flex;
        justify-content: flex-start;
        flex-direction: column;

        .header {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 20px;

          .name {
            color: #deb762;
            font-size: 24px;
            margin-right: 20px;
          }
        }

        .desc {
          font-size: 16px;
          line-height: 30px;
        }
      }
    }
  }
</style>