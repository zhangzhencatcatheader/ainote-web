# 📁 项目配置

AI Note Web 项目的详细配置文件说明。

## 📋 配置文件概览

```
项目根目录/
├── vite.config.ts        # Vite 构建配置
├── tsconfig.json         # TypeScript 编译配置
├── tailwind.config.js    # Tailwind CSS 配置
├── postcss.config.js     # PostCSS 处理配置
├── package.json          # 项目依赖和脚本
├── .eslintrc.cjs         # ESLint 代码检查配置
├── .prettierrc           # Prettier 代码格式化配置
└── .env.example          # 环境变量示例
```

## ⚙️ Vite 配置

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],

  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/stores': resolve(__dirname, 'src/stores'),
      '@/api': resolve(__dirname, 'src/api')
    }
  },

  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['tdesign-vue-next', 'vant'],
          utils: ['axios', 'lodash-es']
        }
      }
    }
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  },

  // 环境变量配置
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false
  }
});
```

### 主要配置说明

- **路径别名**: 简化导入路径，`@` 指向 `src` 目录
- **开发代理**: `/api` 请求代理到后端服务器
- **代码分割**: 将依赖包分离到不同的 chunk
- **构建优化**: 移除 console 和 debugger，压缩代码

## 📘 TypeScript 配置

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/utils/*": ["src/utils/*"],
      "@/stores/*": ["src/stores/*"],
      "@/api/*": ["src/api/*"],
      "@/types/*": ["src/types/*"]
    },

    /* Vue specific */
    "allowJs": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/**/*.d.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

### 严格模式配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🎨 Tailwind CSS 配置

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // 颜色系统
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827'
        }
      },

      // 字体系统
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },

      // 间距系统
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },

      // 阴影系统
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1)'
      },

      // 断点系统
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      },

      // 动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },

  plugins: [
    // 表单插件
    require('@tailwindcss/forms'),

    // 排版插件
    require('@tailwindcss/typography'),

    // 容器查询插件
    require('@tailwindcss/container-queries')
  ],

  // 开发环境配置
  corePlugins: {
    // 禁用预检样式（与其他 CSS 框架冲突时）
    preflight: process.env.NODE_ENV === 'production'
  }
}
```

## 📝 PostCSS 配置

### `postcss.config.js`

```javascript
export default {
  plugins: {
    // Tailwind CSS
    tailwindcss: {},

    // Autoprefixer - 自动添加浏览器前缀
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead'
      ]
    },

    // CSS nano - 压缩 CSS
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: false
        }]
      }
    } : {})
  }
}
```

## 🔧 ESLint 配置

### `.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:vue/vue3-recommended',
    './.eslintrc-auto-import.json'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',

    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',

    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
```

## 🎯 Prettier 配置

### `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "vueIndentScriptAndStyle": false
}
```

### Prettier 忽略配置

### `.prettierignore`

```
node_modules
dist
dist-ssr
coverage
*.local
*.min.js
*.min.css
```

## 🌍 环境变量配置

### `.env.example`

```env
# 应用配置
VITE_APP_TITLE=AI Note Web
VITE_APP_VERSION=1.0.0

# API 配置
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000

# 功能开关
VITE_ENABLE_MOCK=true
VITE_ENABLE_DEVTOOLS=true

# 第三方服务
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=

# 构建配置
VITE_DROP_CONSOLE=false
VITE_SOURCE_MAP=true
```

### 环境变量类型定义

### `src/types/env.d.ts`

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_MOCK: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_DROP_CONSOLE: string;
  readonly VITE_SOURCE_MAP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 📦 包管理配置

### `package.json`

```json
{
  "name": "ainote-web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "type-check": "vue-tsc --noEmit",
    "format": "prettier --write src/",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "engines": {
    "node": ">=16.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

## 🔍 配置验证

### 检查配置文件

```bash
# 检查 TypeScript 配置
npx tsc --showConfig

# 检查 Vite 配置
npx vite build --mode production --dry-run

# 检查 ESLint 配置
npx eslint --print-config src/App.vue

# 检查 Prettier 配置
echo "test;" | npx prettier --stdin --parser babel
```

### 配置最佳实践

1. **版本一致性**: 确保所有工具版本兼容
2. **环境隔离**: 开发和生产配置分离
3. **类型安全**: 所有配置都有 TypeScript 支持
4. **可维护性**: 配置清晰，注释完整
5. **性能优化**: 构建配置考虑性能因素

---

💡 **提示**: 修改配置后记得重启开发服务器以应用新配置。