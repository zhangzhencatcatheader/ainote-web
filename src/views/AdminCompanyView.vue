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
import type { CompanyDto } from "@/api/model/dto";
import type { AccountCompanyEntityDto } from "@/api/model/dto";

type CompanyRow = CompanyDto['CompanyService/LIST_COMPANY'] & {
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
    { colKey: "name", title: "企业名称", width: 200 },
    { colKey: "code", title: "企业编码", width: 150 },
    { colKey: "address", title: "地址", width: 200 },
    { colKey: "memberCount", title: "人员总数", width: 100 },
    { colKey: "admin", title: "企业管理员", width: 150 },
    { colKey: "actions", title: "操作", width: 220, fixed: "right" },
];

const companyMembers = ref<Record<string, ReadonlyArray<AccountCompanyEntityDto['CompanyService/COMPANY_MEMBER']>>>({});
const memberCounts = ref<Record<string, number>>({});
const setAdminDialogVisible = ref(false);
const currentCompany = ref<CompanyRow | null>(null);
const selectedAdminId = ref("");
const settingAdmin = ref(false);
const loadingMembers = ref(false);

const tableData = computed(() => {
    const rows = [...data.value];
    const missing = Math.max(0, pageSize.value - rows.length);
    for (let i = 0; i < missing; i++) {
        rows.push({
            id: `empty-${i}`,
            name: "",
            code: "",
            address: "",
            tenant: "",
            accountCompanies: [],
            __empty: true,
        });
    }
    return rows;
});

const getCompanyAdmin = (row: CompanyRow) => {
    return row.accountCompanies?.find(ac => ac.role === 'ADMIN');
};

const hasAdmin = (row: CompanyRow) => {
    return !!getCompanyAdmin(row);
};

const getMemberCount = (row: CompanyRow) => {
    return memberCounts.value[row.id] ?? 0;
};

const getCompanyUsers = (companyId: string) => {
    const members = companyMembers.value[companyId] || [];
    return members.filter(m => m.role !== 'ADMIN');
};

const getCurrentCompanyUsers = computed(() => {
    if (!currentCompany.value) return [];
    return getCompanyUsers(currentCompany.value.id);
});

const fetchCompanyMembers = async (companyId: string) => {
    if (companyMembers.value[companyId]) {
        return;
    }
    loadingMembers.value = true;
    try {
        const members = await api.companyService.getCompanyMembers({ companyId });
        companyMembers.value[companyId] = members;
        memberCounts.value[companyId] = members.length;
    } catch (error) {
        console.error("获取企业成员失败", error);
        showError("获取企业成员失败");
    } finally {
        loadingMembers.value = false;
    }
};

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
        
        data.value.forEach(company => {
            fetchCompanyMembers(company.id);
        });
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


const openSetAdminDialog = async (row: CompanyRow) => {
    currentCompany.value = row;
    selectedAdminId.value = "";
    await fetchCompanyMembers(row.id);
    setAdminDialogVisible.value = true;
};

const handleSetAdmin = async () => {
    if (!currentCompany.value || !selectedAdminId.value) {
        showError("请选择管理员");
        return;
    }
    settingAdmin.value = true;
    try {
        await api.companyService.setAdmin({
            body: {
                companyId: currentCompany.value.id,
                account: selectedAdminId.value,
            },
        });
        MessagePlugin.success("设置成功");
        setAdminDialogVisible.value = false;
        selectedAdminId.value = "";
        currentCompany.value = null;
        fetchList();
    } catch (error) {
        console.error("设置管理员失败", error);
        showError("设置管理员失败，请稍后再试");
    } finally {
        settingAdmin.value = false;
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
                    <template #memberCount="{ row }">
                        <span v-if="!row.__empty">{{ getMemberCount(row) }}</span>
                    </template>
                    <template #admin="{ row }">
                        <span v-if="!row.__empty && hasAdmin(row)" class="admin-name">
                            {{ getCompanyAdmin(row)?.account.username }}
                        </span>
                        <span v-else-if="!row.__empty">-</span>
                    </template>
                    <template #actions="{ row }">
                        <Space v-if="!row.__empty" size="small">
                            <Button
                                v-if="!hasAdmin(row)"
                                theme="primary"
                                size="small"
                                variant="outline"
                                @click="openSetAdminDialog(row)"
                            >设置管理员</Button>
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
        </div>

        <Dialog
            v-model:visible="setAdminDialogVisible"
            header="设置企业管理员"
            width="500px"
            :confirm-btn="{
                content: '确定',
                theme: 'primary',
                loading: settingAdmin,
            }"
            :cancel-btn="{ content: '取消' }"
            @confirm="handleSetAdmin"
        >
            <Form :label-width="100">
                <FormItem label="企业名称">
                    <span>{{ currentCompany?.name }}</span>
                </FormItem>
                <FormItem label="选择管理员" required>
                    <Select
                        v-model="selectedAdminId"
                        placeholder="请选择管理员"
                        :loading="loadingMembers"
                    >
                        <Option
                            v-for="user in getCurrentCompanyUsers"
                            :key="user.account.id"
                            :value="user.account.id"
                            :label="user.account.username"
                        />
                    </Select>
                </FormItem>
            </Form>
        </Dialog>

        <Dialog
            v-model:visible="addDialogVisible"
            header="新建企业"
            width="600px"
            :confirm-btn="{ content: '保存', theme: 'primary', loading }"
            @confirm="handleAdd"
        >
            <Form :label-width="100">
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
        </Dialog>
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

.admin-cell {
    display: flex;
    align-items: center;
    min-height: 32px;
}

.admin-name {
    color: #1d1f23;
    font-weight: 500;
}

.admin-selector {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
}

.admin-select {
    flex: 1;
    min-width: 120px;
}

.admin-set-btn {
    flex-shrink: 0;
    min-width: 56px;
}
</style>
