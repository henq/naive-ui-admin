<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <div class="view-account-top-logo">
          <img src="~@/assets/images/account-logo.png" alt=""/>
        </div>
        <div class="view-account-top-desc">Naive Ui Admin中台前端/设计解决方案</div>
      </div>
      <div class="view-account-form">
        <n-form ref="formRef" label-placement="left" size="large" :model="formInline" :rules="rules">
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline/>
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input v-model:value="formInline.password" type="password" show-password-toggle placeholder="请输入密码">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline/>
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="autoLogin">自动登录</n-checkbox>
              </div>
              <div class="flex-initial order-last">
                <a href="javascript:;">忘记密码</a>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex view-account-other">
              <div class="flex-initial">
                <span>其它登录方式</span>
              </div>
              <div class="flex-initial mx-2">
                <a href="javascript:;">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoGithub/>
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial mx-2">
                <a href="javascript:;">
                  <n-icon size="24" color="#2d8cf0">
                    <LogoFacebook/>
                  </n-icon>
                </a>
              </div>
              <div class="flex-initial" style="margin-left:auto">
                <a href="javascript:;">注册账号</a>
              </div>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { PersonOutline, LockClosedOutline, LogoGithub, LogoFacebook } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useMessage } from 'naive-ui'
import { ResultEnum } from '@/enums/httpEnum'

interface FormState {
  username: string
  password: string
}

export default defineComponent({
  components: { PersonOutline, LockClosedOutline, LogoGithub, LogoFacebook },
  setup() {
    const formRef = ref()
    const message = useMessage()
    const state = reactive({
      loading: false,
      autoLogin: true,
      formInline: {
        username: 'admin',
        password: '123456'
      }
    })
    const rules = {
      username: { required: true, message: '请输入用户名！', trigger: 'blur' },
      password: { required: true, message: '请输入密码！', trigger: 'blur' }
    }
    const userStore = useUserStore();

    const router = useRouter()
    const route = useRoute()
    let loadingMessage
    const handleSubmit = (e) => {
      e.preventDefault()
      formRef.value.validate(async (errors) => {
        if (!errors) {
          const { username, password } = state.formInline
          loadingMessage = message.loading('登录中...')
          state.loading = true

          const params: FormState = {
            username,
            password
          }

          const { code, message: msg } = await userStore.login(params)

          if (code == ResultEnum.SUCCESS) {
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
            message.success('登录成功！')
            router.replace(toPath).then((_) => {
              if (route.name == 'login') {
                router.replace('/')
              }
            })
          } else {
            message.info(msg || '登录失败')
          }
        } else {
          message.error('请填写完整信息')
        }
      })
    }
    return {
      ...toRefs(state),
      formRef,
      rules,
      handleSubmit
    }
  }
})
</script>

<style lang="less" scoped>
.view-account {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  &-container {
    flex: 1;
    padding: 32px 0;
    width: 384px;
    margin: 0 auto;
  }

  &-top {
    padding: 32px 0;
    text-align: center;

    &-logo {
      height: 75px;
    }

    &-desc {
      font-size: 14px;
      color: #808695;
      margin-top: 20px;
    }
  }

  &-other {
    width: 100%;
  }

  .default-color {
    color: #515a6e;

    .ant-checkbox-wrapper {
      color: #515a6e;
    }
  }
}

@media (min-width: 768px) {
  .view-account {
    background-image: url('@/assets/images/login.svg');
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100%;
  }

  .page-account-container {
    padding: 32px 0 24px 0;
  }
}
</style>
