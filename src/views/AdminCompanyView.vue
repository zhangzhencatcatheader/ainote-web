<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
    Card,
    Space,
    Input,
    Button,
    Table,
    Dialog,
    Form,
    FormItem,
    Select,
    Option,
    MessagePlugin,
    Pagination,
} from "tdesign-vue-next";
import type { PrimaryTableCol, TableRowData } from "tdesign-vue-next";
import WebLayout from "@/components/WebLayout.vue";
import { api } from "@/utils/api";
import { showError } from "@/utils/message";
import { getCurrentTenant } from "@/utils/tenant";
import { CompanyStatus_CONSTANTS } from "@/api/model/enums/CompanyStatus";
import type { CompanyStatus } from "@/api/model/enums/CompanyStatus";
import type { CompanyAddInput } from "@/api/model/static/CompanyAddInput";

type CompanyRow = {
    id: string;
    name: string;
    code: string;
    address?: string;
    __empty?: boolean;
};

const loading = ref(false);
const data = ref<CompanyRow[]>([]);
const total = ref(0);
const pageIndex = ref(1);
const pageSize = ref(10);
const keywords = ref("");
const status = ref<CompanyStatus | undefined>();

const addDialogVisible = ref(false);
const addForm = ref<CompanyAddInput>({
    name: "",
    code: "",
    phone: "",
    address: "",
    contact: "",
    status: "ACTIVE",
    tenant: getCurrentTenant() || "",
});

const columns: PrimaryTableCol<TableRowData>[] = [
    { colKey: "name", title: "企业名称" },
    { colKey: "code", title: "企业编码" },
    { colKey: "address", title: "地址" },
    { colKey: "actions", title: "操作", width: 160, fixed: "right" },
];

const tableData = computed(() => {
    const rows = [...data.value];
    const missing = Math.max(0, pageSize.value - rows.length);
    for (let i = 0; i < missing; i++) {
        rows.push({
            id: `empty-${i}`,
            name: "",
            code: "",
            address: "",
            __empty: true,
        });
    }
    return rows;
});

const fetchList = async () => {
    loading.value = true;
    try {
        const res = await api.companyService.pageCompany({
            pageIndex: Math.max(0, pageIndex.value - 1),
            pageSize: pageSize.value,
            search: {
                keywords: keywords.value || undefined,
                status: status.value,
            },
        });
        data.value = (res.rows || []) as CompanyRow[];
        total.value = res.totalRowCount || 0;
    } catch (error) {
        console.error("获取企业列表失败", error);
        showError("获取企业列表失败，请稍后再试");
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
    pageIndex.value = pageInfo.current;
    pageSize.value = pageInfo.pageSize;
    fetchList();
};

const resetFilters = () => {
    keywords.value = "";
    status.value = undefined;
    pageIndex.value = 1;
    fetchList();
};

const openAddDialog = () => {
    addForm.value = {
        name: "",
        code: "",
        phone: "",
        address: "",
        contact: "",
        status: "ACTIVE",
        tenant: getCurrentTenant() || "",
    };
    addDialogVisible.value = true;
};

const handleAdd = async () => {
    if (!addForm.value.name || !addForm.value.code) {
        showError("请填写企业名称和编码");
        return;
    }
    if (!addForm.value.tenant) {
        showError("请设置租户（tenant）");
        return;
    }
    loading.value = true;
    try {
        await api.companyService.add({ input: addForm.value });
        MessagePlugin.success("创建成功");
        addDialogVisible.value = false;
        fetchList();
    } catch (error) {
        console.error("创建企业失败", error);
        showError("创建企业失败，请检查输入或稍后再试");
    } finally {
        loading.value = false;
    }
};

const handleDelete = async (row: CompanyRow) => {
    const confirm = await Dialog.confirm({
        header: "确认删除",
        body: `确定删除企业「${row.name}」吗？此操作不可恢复。`,
        confirmBtn: "删除",
        cancelBtn: "取消",
        theme: "danger",
    });
    if (confirm) {
        loading.value = true;
        try {
            await api.companyService.delete({ id: row.id });
            MessagePlugin.success("删除成功");
            fetchList();
        } catch (error) {
            console.error("删除失败", error);
            showError("删除失败，请稍后再试");
        } finally {
            loading.value = false;
        }
    }
};

onMounted(() => {
    fetchList();
});
</script>

<template>
    <WebLayout>
        <div class="company-page">
            <Card title="企业管理" bordered hover-shadow>
                <template #actions>
                    <Space size="small" align="center">
                        <Button
                            theme="default"
                            variant="outline"
                            @click="fetchList"
                            :loading="loading"
                            >刷新</Button
                        >
                        <Button theme="primary" @click="openAddDialog"
                            >新建企业</Button
                        >
                    </Space>
                </template>

                <div class="filters">
                    <Space size="small" align="center" class="filters-inline">
                        <Input
                            v-model="keywords"
                            size="medium"
                            clearable
                            placeholder="搜索名称/编码"
                            @enter="fetchList"
                        />
                        <Select
                            v-model="status"
                            clearable
                            placeholder="全部状态"
                        >
                            <Option
                                v-for="s in CompanyStatus_CONSTANTS"
                                :key="s"
                                :value="s"
                                :label="s"
                            />
                        </Select>
                        <Button theme="primary" @click="fetchList">查询</Button>
                        <Button
                            variant="outline"
                            theme="default"
                            @click="resetFilters"
                            >清空</Button
                        >
                    </Space>
                </div>
                <Table
                    row-key="id"
                    :data="tableData"
                    :columns="columns"
                    :loading="loading"
                    bordered
                    stripe
                    size="medium"
                >
                    <template #address="{ row }">
                        {{ row.address || "-" }}
                    </template>
                    <template #actions="{ row }">
                        <Space v-if="!row.__empty" size="small">
                            <Button
                                theme="default"
                                variant="outline"
                                size="small"
                                disabled
                                >编辑</Button
                            >
                            <Button
                                theme="danger"
                                variant="outline"
                                size="small"
                                @click="handleDelete(row)"
                                >删除</Button
                            >
                        </Space>
                    </template>
                </Table>

                <div class="pagination-wrap">
                    <Pagination
                        v-model:current="pageIndex"
                        v-model:page-size="pageSize"
                        size="medium"
                        :total="total"
                        :page-size-options="[10, 20, 50]"
                        @change="handlePageChange"
                    />
                </div>
            </Card>

            <Dialog
                v-model:visible="addDialogVisible"
                header="新建企业"
                width="600"
            >
                <Form label-width="100px">
                    <FormItem label="企业名称" required>
                        <Input
                            v-model="addForm.name"
                            placeholder="请输入企业名称"
                        />
                    </FormItem>
                    <FormItem label="企业编码" required>
                        <Input
                            v-model="addForm.code"
                            placeholder="请输入企业编码"
                        />
                    </FormItem>
                    <FormItem label="联系人">
                        <Input
                            v-model="addForm.contact"
                            placeholder="联系人姓名"
                        />
                    </FormItem>
                    <FormItem label="联系电话">
                        <Input v-model="addForm.phone" placeholder="联系电话" />
                    </FormItem>
                    <FormItem label="地址">
                        <Input
                            v-model="addForm.address"
                            placeholder="企业地址"
                        />
                    </FormItem>
                    <FormItem label="状态" required>
                        <Select
                            v-model="addForm.status"
                            placeholder="请选择状态"
                        >
                            <Option
                                v-for="s in CompanyStatus_CONSTANTS"
                                :key="s"
                                :value="s"
                                :label="s"
                            />
                        </Select>
                    </FormItem>
                    <FormItem label="租户" required>
                        <Input
                            v-model="addForm.tenant"
                            placeholder="租户 ID（tenant）"
                        />
                    </FormItem>
                </Form>
                <template #footer>
                    <Space>
                        <Button
                            theme="default"
                            @click="addDialogVisible = false"
                            >取消</Button
                        >
                        <Button
                            theme="primary"
                            :loading="loading"
                            @click="handleAdd"
                            >保存</Button
                        >
                    </Space>
                </template>
            </Dialog>
        </div>
    </WebLayout>
</template>

<style scoped>
.company-page {
    padding: 24px;
    background: #f6f8fb;
    min-height: 100vh;
}

.filters {
    margin: 12px 0;
}

.pagination-wrap {
    display: flex;
    justify-content: flex-end;
    padding: 12px 0;
}
</style>
