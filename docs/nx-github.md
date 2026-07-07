# Nx 与 GitHub CI 简明说明

本文档说明本项目中 Nx 和 GitHub Actions 的配合方式。

## 当前项目

- 包管理器：`pnpm`
- Nx 配置：`nx.json`
- GitHub CI 文件：`.github/workflows/ci.yml`
- CI 主要命令：`pnpm nx affected -t lint test build`
- Nx Cloud 已在 `nx.json` 中配置工作区 ID

## 改动代码后会发生什么

当你改动代码并推送到指定分支，或创建/更新 Pull Request 时，GitHub 会自动运行 CI。

当前流程：

1. GitHub 拉取最新代码。
2. 安装 pnpm 和 Node.js。
3. 安装项目依赖。
4. Nx 判断这次改动影响了哪些项目。
5. 执行 `pnpm nx affected -t lint test build`，只对受影响的项目运行 `lint`、`test`、`build`。
6. 命令完成后，Nx 会把这些任务的构建结果推送到 Nx Cloud。
7. 后续遇到相同任务时，Nx 可以直接复用 Nx Cloud 中的缓存结果。
8. 如果 CI 失败，运行 `pnpm nx-cloud fix-ci`，让 Nx Cloud 尝试分析失败原因。

## 为什么用 Nx

Nx 会尽量少做重复工作：

- 只检查、测试、构建受影响的项目。
- 对相同输入的任务复用缓存结果。
- 在 CI 中配合 Nx Cloud 后，可以跨机器复用缓存，加快后续构建。

## GitHub 需要配置的密钥

CI 中需要配置：

```text
NX_CLOUD_ACCESS_TOKEN
```

配置位置：

```text
GitHub 仓库 -> Settings -> Secrets and variables -> Actions -> New repository secret
```

名称填：

```text
NX_CLOUD_ACCESS_TOKEN
```

值从 Nx Cloud 获取：

```text
Nx Cloud -> Workspace Settings -> Access Tokens
```

建议：

- 受保护分支使用可读写 token。
- 普通 PR 或非受保护分支使用只读 token。
- 不要把 token 写进代码，只放在 GitHub Secrets 中。

当前 CI 已经通过下面方式读取这个密钥：

```yaml
env:
  NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}
```

## 常用命令

本地构建全部项目：

```bash
pnpm nx run-many -t build
```

只处理受影响项目：

```bash
pnpm nx affected -t lint test build
```

查看项目列表：

```bash
pnpm nx show projects
```

查看项目依赖图：

```bash
pnpm nx graph
```

## 备注

如果 CI 日志里出现 Nx Cloud 连接或权限问题，优先检查：

1. GitHub Secrets 中是否存在 `NX_CLOUD_ACCESS_TOKEN`。
2. token 是否来自正确的 Nx Cloud 工作区。
3. token 权限是否满足当前分支的使用场景。
