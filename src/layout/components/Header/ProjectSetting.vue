<template>
  <n-drawer v-model:show="isDrawer" :width="width" :placement="placement" :native-scrollbar="false">
    <n-drawer-content :title="title">
      <div class="drawer">
        <n-divider title-placement="center">主题</n-divider>

        <div class="drawer-setting-item justify-center dark-switch">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-switch v-model:value="designStore.darkTheme"/>
            </template>
            <span>深色主题</span>
          </n-tooltip>

        </div>

        <n-divider title-placement="center">系统主题</n-divider>

        <div class="drawer-setting-item align-items-top">
          <span class="theme-item"
                v-for="(item, index) in appThemeList"
                :key="index"
                :style="{'background-color':item}"
                @click="togTheme(item)"
          >
            <n-icon size="12" v-if="item === designStore.appTheme">
              <CheckOutlined/>
            </n-icon>
          </span>
        </div>

        <n-divider title-placement="center">导航栏模式</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/nav-theme-dark.svg" @click="togNavMode('vertical')"/>
              </template>
              <span>左侧菜单模式</span>
            </n-tooltip>
            <n-badge dot color="#19be6b" v-show="settingStore.navMode === 'vertical'"/>
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/nav-horizontal.svg" @click="togNavMode('horizontal')"/>
              </template>
              <span>顶部菜单模式</span>
            </n-tooltip>
            <n-badge dot color="#19be6b" v-show="settingStore.navMode === 'horizontal'"/>
          </div>
        </div>


        <n-divider title-placement="center">导航栏风格</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/nav-theme-dark.svg" @click="togNavTheme('dark')"/>
              </template>
              <span>暗色侧边栏</span>
            </n-tooltip>
            <n-badge dot color="#19be6b" v-if="settingStore.navTheme === 'dark'"/>
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/nav-theme-light.svg" @click="togNavTheme('light')"/>
              </template>
              <span>白色侧边栏</span>
            </n-tooltip>
            <n-badge dot color="#19be6b" v-if="settingStore.navTheme === 'light'"/>
          </div>
        </div>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/header-theme-dark.svg" @click="togNavTheme('header-dark')"/>
              </template>
              <span>暗色顶栏</span>
            </n-tooltip>
            <n-badge dot color="#19be6b" v-if="settingStore.navTheme === 'header-dark'"/>
          </div>
        </div>

        <n-divider title-placement="center">界面功能</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            固定顶栏
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.headerSetting.fixed"/>
          </div>
        </div>

        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title">-->
        <!--            固定侧边栏-->
        <!--          </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="settingStore.menuSetting.fixed" />-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            固定多页签
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.multiTabsSetting.fixed"/>
          </div>
        </div>

        <n-divider title-placement="center">界面显示</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            显示重载页面按钮
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.headerSetting.isReload"/>
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            显示面包屑导航
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.crumbsSetting.show"/>
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            显示面包屑显示图标
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.crumbsSetting.showIcon"/>
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            显示多页签
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.multiTabsSetting.show"/>
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">
            显示页脚
          </div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="settingStore.showFooter"/>
          </div>
        </div>


        <div class="drawer-setting-item">
          <n-alert type="warning" :showIcon="false">
            <p>{{ alertText }}</p>
          </n-alert>
        </div>

      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, createVNode, computed, unref } from 'vue'
import { useProjectSettingStore } from "@/store/modules/projectSetting";
import { useDesignSettingStore } from "@/store/modules/designSetting";
import { CheckOutlined } from '@vicons/antd'
import { darkTheme } from 'naive-ui'

export default defineComponent({
  name: 'ProjectSetting',
  props: {
    title: {
      type: String,
      default: '项目配置'
    },
    width: {
      type: Number,
      default: 280
    },
  },
  components: { CheckOutlined },
  setup(props, { emit }) {
    const settingStore = useProjectSettingStore()
    const designStore = useDesignSettingStore()
    const { width, title } = props
    const state = reactive({
      width,
      title,
      isDrawer: false,
      placement: "right",
      alertText: '该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts 中设置，建议在生产环境关闭该布局预览功能。',
      appThemeList: designStore.appThemeList
    })

    watch(
      () => designStore.darkTheme,
      (to) => {
        settingStore.navTheme = to ? 'header-dark' : 'dark'
      }
    )

    function openDrawer(isDrawer) {
      state.isDrawer = true
    }

    function closeDrawer() {
      state.isDrawer = false
    }

    function togNavTheme(theme) {
      settingStore.navTheme = theme
      if (settingStore.navMode === 'horizontal' && theme === 'light') {
        designStore.navTheme = 'dark'
      }
    }

    function togTheme(color) {
      designStore.appTheme = color
    }

    function togNavMode(mode) {
      settingStore.navMode = mode
      if (mode === 'horizontal') {
        settingStore.setNavTheme('light')
      } else {
        settingStore.setNavTheme('dark')
      }
    }

    return {
      ...toRefs(state),
      settingStore,
      designStore,
      togNavTheme,
      togNavMode,
      togTheme,
      darkTheme,
      openDrawer,
      closeDrawer,
    }
  }
})
</script>

<style lang="less" scoped>
.drawer {
  .n-divider:not(.n-divider--vertical) {
    margin: 10px 0;
  }

  &-setting-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    flex-wrap: wrap;

    &-style {
      display: inline-block;
      position: relative;
      margin-right: 16px;
      cursor: pointer;
      text-align: center;
    }

    &-title {
      flex: 1 1;
      font-size: 14px;
    }

    &-action {
      flex: 0 0 auto;
    }

    .theme-item {
      width: 20px;
      min-width: 20px;
      height: 20px;
      cursor: pointer;
      border: 1px solid #eee;
      border-radius: 2px;
      margin: 0 5px 5px 0;
      text-align: center;

      .n-icon {
        color: #fff
      }
    }
  }

  .align-items-top {
    align-items: flex-start;
    padding: 2px 0;
  }

  .justify-center {
    justify-content: center;
  }

  .dark-switch .n-switch--active {
    ::v-deep(.n-switch__rail) {
      background-color: #000e1c;
    }
  }
}
</style>
