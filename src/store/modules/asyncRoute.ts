import { toRaw, unref } from 'vue'
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { store } from '@/store'
import { createStorage } from '@/utils/Storage'
import { asyncRoutes, constantRouter } from '@/router/index'
import { generatorDynamicRouter } from '@/router/generator-routers'
import { useProjectSetting } from '@/hooks/setting/useProjectSetting'

const Storage = createStorage({ storage: localStorage })


interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

interface AsyncRouteState {
  menus: RouteRecordRaw[],
  routers: any[],
  addRouters: any[],
  keepAliveComponents: string[],
  isDynamicAddedRoute: boolean
}


function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {}
): T[] {
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export const useAsyncRouteStore = defineStore({
  id: 'app-async-route',
  state: (): AsyncRouteState => ({
    menus: [],
    routers: constantRouter,
    addRouters: [],
    keepAliveComponents: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
  }),
  getters: {
    getMenus(state: AsyncRouteState): RouteRecordRaw[] {
      return this.menus
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    getRouters() {
      return toRaw(this.addRouters)
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    // 设置动态路由
    setRouters(routers) {
      this.addRouters = routers
      this.routers = constantRouter.concat(routers)
    },
    setMenus(menus) {
      // 设置动态路由
      this.menus = menus
    },
    setKeepAliveComponents(compNames) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames
    },
    async generateRoutes(data) {
      let accessedRouters
      const roleList = data.roles || []
      const routeFilter = (route) => {
        const { meta } = route;
        const { permission } = meta || {};
        if (!permission) return true;
        return roleList.some((role) => permission.includes(role.value));
      };
      const { getPermissionMode } = useProjectSetting()
      const permissionMode = unref(getPermissionMode)
      if (permissionMode === 'BACK') {
        // 动态获取菜单
        try {
          accessedRouters = await generatorDynamicRouter()
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          //过滤账户是否拥有某一个权限，并将菜单从加载列表移除
          accessedRouters = filter([...asyncRoutes, ...constantRouter], routeFilter);
        } catch (error) {
          console.log(error)
        }
      }
      accessedRouters = accessedRouters.filter(routeFilter);
      this.setRouters(accessedRouters)
      this.setMenus(accessedRouters)
      return toRaw(accessedRouters)
    }
  }
})

// Need to be used outside the setup
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}
