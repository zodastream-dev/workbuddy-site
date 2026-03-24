# WorkBuddy 网站 - 部署指南

## 技术栈
- **前端**：React 18 + Tailwind CSS（CDN）
- **认证 + 数据库**：Supabase
- **托管**：GitHub Pages
- **域名**：workbuddy.yookeer.com（阿里云 DNS）
- **自动部署**：GitHub Actions

---

## 第一步：注册 Supabase 并配置数据库

1. 访问 [https://supabase.com](https://supabase.com)，用 GitHub 账号登录
2. 点击 **New Project**，填写项目名称（如 `workbuddy`），选择区域（建议选 **Asia - Singapore**）
3. 项目创建后，进入 **Project Settings → API**，找到并复制：
   - `Project URL`（形如 `https://xxxxxxxx.supabase.co`）
   - `anon public` key（很长的一串）

4. 进入 **SQL Editor**，运行以下 SQL 创建任务表：

```sql
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  priority text default 'medium',
  done boolean default false,
  created_at timestamptz default now()
);

-- 开启行级安全
alter table todos enable row level security;

-- 每个用户只能操作自己的数据
create policy "Users manage own todos" on todos
  for all using (auth.uid() = user_id);
```

---

## 第二步：上传代码到 GitHub

1. 在 GitHub 上新建一个仓库（建议名称：`workbuddy-site`，设为 **Public**）
2. 将本地代码上传：

```bash
cd workbuddy-site
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的用户名/workbuddy-site.git
git push -u origin main
```

---

## 第三步：在 GitHub 配置 Secrets

进入仓库 → **Settings → Secrets and variables → Actions → New repository secret**，添加两个：

| 名称 | 值 |
|------|-----|
| `REACT_APP_SUPABASE_URL` | 你的 Supabase Project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | 你的 Supabase anon key |

---

## 第四步：开启 GitHub Pages

进入仓库 → **Settings → Pages**：
- Source 选择 **Deploy from a branch**
- Branch 选择 **gh-pages**，目录选 `/ (root)`
- 点击 Save

推送代码后，GitHub Actions 会自动构建并部署（约 2-3 分钟）。

---

## 第五步：配置阿里云 DNS

登录阿里云控制台 → 域名 → yookeer.com → 解析设置，添加一条记录：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME | workbuddy | 你的GitHub用户名.github.io |

例如：`workbuddy` → `lujun.github.io`

DNS 生效后（通常 5-10 分钟），访问 `https://workbuddy.yookeer.com` 即可看到网站！

---

## 完成！网站功能

- ✅ 首页介绍
- ✅ 用户注册（邮箱 + 密码）
- ✅ 用户登录
- ✅ 任务管理（增删、完成标记、优先级）
- ✅ 任务筛选（全部 / 待完成 / 已完成）
- ✅ 进度统计
- ✅ 自动部署（推送代码自动更新网站）
