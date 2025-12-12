<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";
import { showConfirm } from "@/utils/message";
import { clearAuthInfo } from "@/utils/tenant";

const router = useRouter();
const appStore = useAppStore();

// 检查是否已登录
const isLoggedIn = computed(() => {
    return !!localStorage.getItem("auth_token");
});

// 获取用户信息
const userId = computed(() => localStorage.getItem("user_id") || "未登录");
const userRole = computed(() => localStorage.getItem("user_role") || "游客");

// 功能菜单数据
const features = ref([
    {
        icon: "📝",
        title: "智能笔记",
        description: "AI 驱动的智能笔记管理，支持自动分类和搜索",
        color: "from-blue-500 to-blue-600",
        path: "/notes",
    },
    {
        icon: "🔍",
        title: "智能搜索",
        description: "强大的搜索功能，快速找到您的笔记内容",
        color: "from-purple-500 to-purple-600",
        path: "/search",
    },
    {
        icon: "📊",
        title: "数据分析",
        description: "可视化数据分析，洞察笔记统计信息",
        color: "from-green-500 to-green-600",
        path: "/analytics",
    },
    {
        icon: "👥",
        title: "团队协作",
        description: "与团队成员共享笔记，实时协作编辑",
        color: "from-orange-500 to-orange-600",
        path: "/team",
    },
    {
        icon: "🔖",
        title: "标签管理",
        description: "灵活的标签系统，让笔记管理更有条理",
        color: "from-pink-500 to-pink-600",
        path: "/tags",
    },
    {
        icon: "⚙️",
        title: "设置中心",
        description: "个性化设置，打造专属的使用体验",
        color: "from-gray-500 to-gray-600",
        path: "/settings",
    },
]);

// 统计数据
const stats = ref([
    { label: "总笔记数", value: "128", icon: "📚", color: "text-blue-600" },
    { label: "本周新增", value: "23", icon: "📈", color: "text-green-600" },
    { label: "收藏数量", value: "45", icon: "⭐", color: "text-yellow-600" },
    { label: "共享笔记", value: "12", icon: "🔄", color: "text-purple-600" },
]);

// 最近活动
const recentActivities = ref([
    {
        id: 1,
        content: "创建了新的笔记：《项目规划》",
        time: "2小时前",
        icon: "📝",
    },
    { id: 2, content: "编辑了笔记：《会议记录》", time: "5小时前", icon: "✏️" },
    { id: 3, content: "收藏了笔记：《技术方案》", time: "1天前", icon: "⭐" },
    { id: 4, content: "分享了笔记：《学习笔记》", time: "2天前", icon: "🔗" },
]);

// 导航到功能页面
const navigateToFeature = (path: string) => {
    if (!isLoggedIn.value) {
        showConfirm({
            title: "需要登录",
            content: "使用此功能需要先登录，是否立即登录？",
        }).then((confirmed) => {
            if (confirmed) {
                router.push("/auth");
            }
        });
        return;
    }
    router.push(path);
};

// 退出登录
const handleLogout = async () => {
    const confirmed = await showConfirm({
        title: "确认退出",
        content: "确定要退出登录吗？",
    });

    if (confirmed) {
        // 使用 tenant 工具清除所有认证信息
        clearAuthInfo();
        router.push("/auth");
    }
};

// 页面加载动画
const isLoaded = ref(false);
onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true;
    }, 100);
});
</script>

<template>
    <div
        class="home-view min-h-screen flex flex-col from-blue-50 via-white to-purple-50"
    >
        <!-- 顶部导航栏 -->
        <header
            class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100"
        >
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div
                        class="w-8 h-8 from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                    >
                        <span class="text-white font-bold text-sm">AI</span>
                    </div>
                    <h1
                        class="text-lg sm:text-xl font-bold from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        {{ appStore.title }}
                    </h1>
                </div>
                <Button
                    v-if="isLoggedIn"
                    type="text"
                    size="sm"
                    @click="handleLogout"
                >
                    退出登录
                </Button>
            </div>
        </header>

        <!-- 主内容区域 -->
        <main class="flex-1 p-4 sm:p-6 md:p-8">
            <div class="max-w-7xl mx-auto">
                <!-- 欢迎区域 -->
                <section
                    class="mb-8 text-center"
                    :class="{
                        'opacity-0 translate-y-4': !isLoaded,
                        'opacity-100 translate-y-0': isLoaded,
                    }"
                >
                    <h2
                        class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                    >
                        欢迎来到
                        <span
                            class="from-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >AI Note</span
                        >
                    </h2>
                    <p
                        class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        智能笔记管理平台，让您的知识管理更高效、更有序
                    </p>
                </section>

                <!-- 统计数据卡片 - 仅在登录时显示 -->
                <section
                    v-if="isLoggedIn"
                    class="mb-8"
                    :class="{
                        'opacity-0 translate-y-4': !isLoaded,
                        'opacity-100 translate-y-0': isLoaded,
                    }"
                >
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div
                            v-for="stat in stats"
                            :key="stat.label"
                            class="bg-white rounded-xl shadow-sm p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-gray-500">
                                        {{ stat.label }}
                                    </p>
                                    <p class="text-2xl font-bold text-gray-800">
                                        {{ stat.value }}
                                    </p>
                                </div>
                                <span class="text-2xl">{{ stat.icon }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 功能网格 -->
                <section class="mb-8">
                    <h3
                        class="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center"
                    >
                        核心功能
                    </h3>
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <div
                            v-for="feature in features"
                            :key="feature.title"
                            @click="navigateToFeature(feature.path)"
                            class="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                            :class="{
                                'opacity-0 translate-y-4': !isLoaded,
                                'opacity-100 translate-y-0': isLoaded,
                            }"
                        >
                            <!-- 渐变背景 -->
                            <div
                                class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                :class="feature.color"
                            ></div>

                            <!-- 内容 -->
                            <div class="relative p-6">
                                <div class="flex items-center mb-4">
                                    <div
                                        class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                                        :class="feature.color"
                                    >
                                        {{ feature.icon }}
                                    </div>
                                </div>
                                <h4
                                    class="text-lg font-semibold text-gray-800 mb-2"
                                >
                                    {{ feature.title }}
                                </h4>
                                <p
                                    class="text-sm text-gray-600 group-hover:text-white transition-colors"
                                >
                                    {{ feature.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 最近活动 - 仅在登录时显示 -->
                <section
                    v-if="isLoggedIn"
                    class="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    <!-- 用户信息卡片 -->
                    <div
                        class="bg-white rounded-xl shadow-sm p-6"
                        :class="{
                            'opacity-0 translate-x-4': !isLoaded,
                            'opacity-100 translate-x-0': isLoaded,
                        }"
                    >
                        <h3
                            class="text-lg font-semibold text-gray-800 mb-4 flex items-center"
                        >
                            <span class="mr-2">👤</span> 用户信息
                        </h3>
                        <div class="space-y-3">
                            <div
                                class="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                                <span class="text-sm text-gray-600"
                                    >登录状态</span
                                >
                                <span
                                    class="text-sm font-medium"
                                    :class="
                                        isLoggedIn
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    "
                                >
                                    {{ isLoggedIn ? "已登录" : "未登录" }}
                                </span>
                            </div>
                            <div
                                v-if="isLoggedIn"
                                class="flex justify-between items-center py-2 border-b border-gray-100"
                            >
                                <span class="text-sm text-gray-600"
                                    >用户ID</span
                                >
                                <span
                                    class="text-sm font-medium text-gray-800"
                                    >{{ userId }}</span
                                >
                            </div>
                            <div
                                v-if="isLoggedIn"
                                class="flex justify-between items-center py-2"
                            >
                                <span class="text-sm text-gray-600">角色</span>
                                <span
                                    class="text-sm font-medium text-blue-600"
                                    >{{ userRole }}</span
                                >
                            </div>
                        </div>
                    </div>

                    <!-- 最近活动 -->
                    <div
                        class="bg-white rounded-xl shadow-sm p-6"
                        :class="{
                            'opacity-0 translate-x-4': !isLoaded,
                            'opacity-100 translate-x-0': isLoaded,
                        }"
                    >
                        <h3
                            class="text-lg font-semibold text-gray-800 mb-4 flex items-center"
                        >
                            <span class="mr-2">🕐</span> 最近活动
                        </h3>
                        <div class="space-y-3">
                            <div
                                v-for="activity in recentActivities"
                                :key="activity.id"
                                class="flex items-start space-x-3 py-2 border-b border-gray-50 last:border-b-0"
                            >
                                <span class="text-lg mt-1">{{
                                    activity.icon
                                }}</span>
                                <div class="flex-1">
                                    <p class="text-sm text-gray-700">
                                        {{ activity.content }}
                                    </p>
                                    <p class="text-xs text-gray-500 mt-1">
                                        {{ activity.time }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA 区域 -->
                <section
                    v-if="!isLoggedIn"
                    class="mt-12 text-center"
                    :class="{
                        'opacity-0 translate-y-4': !isLoaded,
                        'opacity-100 translate-y-0': isLoaded,
                    }"
                >
                    <div
                        class="from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
                    >
                        <h3 class="text-2xl font-bold mb-4">
                            开始使用 AI Note
                        </h3>
                        <p class="text-lg mb-6 opacity-90">
                            登录体验更多智能功能，让笔记管理变得简单高效
                        </p>
                        <Button
                            type="primary"
                            size="lg"
                            class="bg-white text-blue-600 hover:bg-gray-100"
                        >
                            立即登录
                        </Button>
                    </div>
                </section>
            </div>
        </main>

        <!-- 底部信息 -->
        <footer
            class="bg-white/50 backdrop-blur-sm border-t border-gray-100 px-4 py-6 sm:px-6"
        >
            <div class="max-w-7xl mx-auto text-center text-sm text-gray-600">
                <p>© 2024 AI Note. Powered by Vue 3 + TypeScript + TDesign</p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
/* 页面加载动画 */
.opacity-0 {
    opacity: 0;
}

.opacity-100 {
    opacity: 1;
}

.translate-y-4 {
    transform: translateY(1rem);
}

.translate-y-0 {
    transform: translateY(0);
}

.translate-x-4 {
    transform: translateX(1rem);
}

.translate-x-0 {
    transform: translateX(0);
}

/* 平滑过渡 */
.transition-all {
    transition: all 0.3s ease;
}

/* 功能卡片悬停效果 */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* 渐变背景动画 */
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* 响应式字体大小优化 */
@media (max-width: 640px) {
    .text-3xl {
        font-size: 1.75rem;
        line-height: 2.25rem;
    }

    .text-4xl {
        font-size: 2rem;
        line-height: 2.5rem;
    }

    .text-5xl {
        font-size: 2.25rem;
        line-height: 2.75rem;
    }
}

/* 玻璃拟态效果增强 */
.backdrop-blur-md {
    backdrop-filter: blur(16px);
}

/* 卡片悬停时的阴影效果 */
.hover\:shadow-xl:hover {
    box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 内容区域的延迟动画 */
section:nth-child(1) {
    transition: all 0.6s ease 0.1s;
}

section:nth-child(2) {
    transition: all 0.6s ease 0.2s;
}

section:nth-child(3) {
    transition: all 0.6s ease 0.3s;
}

section:nth-child(4) {
    transition: all 0.6s ease 0.4s;
}

section:nth-child(5) {
    transition: all 0.6s ease 0.5s;
}
</style>
