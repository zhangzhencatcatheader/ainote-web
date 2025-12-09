# AI Note Web 项目开发约束文档

## 概述

本文档定义了 `ainote-web` 项目的开发约束和规范要求，所有开发人员必须严格遵守。

## 核心约束

### 1. API 层保护约束 ⚠️

**严禁修改 `src/api` 目录下的任何内容**

- **约束范围**: `/src/api/` 目录及其所有子目录和文件
- **原因**: 该目录下的所有代码由后端自动生成，任何手动修改都将在代码同步时被覆盖
- **包含内容**:
  - `/src/api/Api.ts` - 主要 API 客户端
  - `/src/api/services/` - API 服务类目录
    - `AuthService.ts`
    - `LogService.ts`
    - `NoteService.ts`
    - `OssService.ts`
  - `/src/api/model/` - API 数据模型目录

**正确做法**:
- 如需扩展 API 功能，请在 `/src/utils/` 或其他合适目录创建包装函数
- 如需修改类型定义，请与后端开发人员沟通

### 2. TypeScript 严格性要求

**必须严格遵循 TypeScript 规范**

#### 2.1 类型定义
- **禁止**使用 `any` 类型，除非有明确的注释说明原因
- **必须**为所有函数参数和返回值定义类型
- **必须**为所有变量和属性定义类型
- **推荐**使用接口 (`interface`) 定义对象结构
- **推荐**使用枚举 (`enum`) 定义常量集合

#### 2.2 类型检查
- **必须**启用 `strict` 模式下的所有 TypeScript 检查
- **禁止**使用 `@ts-ignore` 注释，除非有明确的不可避免的原因
- **禁止**使用类型断言 (`as`) 除非绝对必要
- **必须**处理所有可能的 `null` 和 `undefined` 情况

#### 2.3 代码示例

```typescript
// ✅ 正确做法
interface UserData {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

function createUser(userData: UserData): Promise<User> {
  // 实现
}

// ❌ 错误做法
function createUser(userData: any): any {
  // 实现
}
```

## 架构约束

### 3. 目录结构规范

```
src/
├── api/                    # 🔒 禁止修改 - 后端生成
│   ├── services/           # API 服务类
│   ├── model/             # API 数据模型
│   └── Api.ts             # 主要 API 客户端
├── components/            # ✅ 可修改 - Vue 组件
│   └── base/              # 基础 UI 组件
├── router/               # ✅ 可修改 - 路由配置
├── stores/               # ✅ 可修改 - Pinia 状态管理
├── utils/                # ✅ 可修改 - 工具函数
│   ├── http.ts           # HTTP 客户端包装
│   ├── api.ts            # API 辅助函数
│   └── device.ts         # 设备检测
└── views/                # ✅ 可修改 - 页面组件
```

### 4. 导入导出规范

- **必须**使用具名导入而非默认导入，除非确实需要
- **必须**按照 ESLint 配置的导入顺序组织代码
- **推荐**使用路径别名 `@` 代替相对路径

```typescript
// ✅ 正确做法
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { BaseButton } from '@/components/base';

// ❌ 错误做法
import Vue from 'vue';
import * as VueRouter from 'vue-router';
```

## 代码质量要求

### 5. 组件开发规范

- **必须**使用 Vue 3 Composition API 和 `<script setup>` 语法
- **必须**为所有 props 定义类型
- **必须**为所有 emits 定义类型
- **推荐**使用 TypeScript 的 `defineComponent` 或 `<script setup lang="ts">`

```typescript
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  disabled?: boolean;
}

interface Emits {
  update: [value: string];
  delete: [id: number];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false
});

const emit = defineEmits<Emits>();
</script>
```

### 6. 状态管理规范

- **必须**使用 Pinia 进行状态管理
- **必须**为 store 的 state、getters、actions 定义完整类型
- **禁止**在组件中直接修改 store 状态，必须通过 actions

### 7. 错误处理规范

- **必须**处理所有可能的异步错误
- **必须**使用 try-catch 包装可能出错的代码
- **必须**提供用户友好的错误信息

## 开发流程约束

### 8. 代码审查要求

所有代码提交前必须确保：
- TypeScript 编译无错误无警告
- ESLint 检查通过
- 没有违反上述约束的行为
- API 层代码未被修改

### 9. 提交规范

- **必须**使用清晰的提交信息
- **必须**避免提交调试代码
- **必须**确保构建可以正常完成

## 违规处理

任何违反上述约束的行为将导致：
- 代码审查被拒绝
- 强制代码重构
- 严重者将影响开发权限

---

**文档维护**: 本文档将根据项目发展持续更新，所有开发人员有责任及时了解和遵守最新约束要求。

**最后更新**: 2025-12-10

**版本**: 1.0.0