# Robix 数据采集改版（面向日本）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 robix.one 改成以真实场景数据采集为核心、JA/EN 双语、面向日本需求方的网站，维修业务降为页脚子区。

**Architecture:** 纯静态站，无构建。日语原文直接写在 HTML（无 JS 也可读），英文放 `assets/i18n.js` 的 `I18N.en[key]`，`data-i18n` 属性切换；启动时把 HTML 原文缓存为日语。新组件（logo 墙、画廊）由 `data.js` 数据驱动，沿用现有 renderer 模式。

**Tech Stack:** HTML/CSS/vanilla JS，GitHub Pages，Formspree，Python(PIL/cv2) 处理素材，node 做 i18n 键检查，gstack browse 做页面验证。

**Spec:** `docs/superpowers/specs/2026-09-25-robix-data-collection-japan-design.md`

## Global Constraints

- 不写、不暗示日本已有采集拠点；影像不标地点
- 数据管理承诺仅 spec §6 的 6 条；不出现 ISO 27001
- 不放运营数字；高校只用文字标
- 默认日语；`?lang=en` 强制英文；选择存 `localStorage("rbx-lang")`
- 表单提交值为英文；隐藏字段 `form_type=data_inquiry`、`lang`
- 手机 375px 无横向滚动；深浅色主题都可读

## Review Focus

- 切换到 EN 后仍残留日语（漏 key）→ `tools/check-i18n.js` 检查每个 `data-i18n` 在 `I18N.en` 中都有值
- 在 EN 下提交表单，错误/草稿提示仍是日语 → wizard 的 UI 文案走 `ui()` 按当前语言取值
- 维修子区（`quote.html`/`join.html`）的表单被 i18n 改动破坏 → 验证两个旧向导仍能逐步前进
- 日语长词在窄屏溢出按钮/导航 → 375px 截图检查
- 无 JS 或 localStorage 抛异常时页面空白 → i18n 所有存储访问 try/catch，HTML 自带日语

---

### Task 1: 素材处理
**Files:** Create `assets/img/*.jpg`, `assets/img/*.webp`, `assets/video/hero.mp4`, `tools/prep-media.py`
- [ ] 裁切 factory 三张（去中文标牌），压缩 7 张直接可用图，长边 ≤2000，JPEG q82 + WebP
- [ ] 截取视频中无人脸、无中文的 10–14 秒，静音，≤4MB，H.264 可在浏览器播放；输出 poster 帧
- [ ] 逐张目检输出，确认无可读中文
- [ ] Commit

### Task 2: i18n 基础设施 + 样式扩展
**Files:** Create `assets/i18n.js`, `tools/check-i18n.js`; Modify `assets/app.js`, `assets/styles.css`
- [ ] `i18n()`：缓存原文 → 按语言替换 `data-i18n`（innerHTML）/`data-i18n-ph`（placeholder）/`data-i18n-title`；`.lang button[data-lang]` 切换；同步 `<html lang>` 与 `input[name=lang]`
- [ ] `ui(key)`：wizard 提示文案按语言取值；无切换器的页面按 `<html lang>`
- [ ] 字体栈加入 Noto Sans JP；新增组件样式：`.lang`、`.logos`、`.gallery`、`.hero-media`、`.phase`、`.pledge`
- [ ] `check-i18n.js`：扫描 HTML 中的 key，报告 `I18N.en` 缺失项；运行应为 0 缺失
- [ ] Commit

### Task 3: 数据块 + 首页
**Files:** Modify `assets/data.js`, `index.html`; Create `repair.html`（原 index 移入）
- [ ] `LOGOS`（14 企业 + 6 高校，含可选 `img`）、`GALLERY`（图、场景 key）
- [ ] `renderLogos()`、`renderGallery()`
- [ ] 首页 10 块按 spec §5；原首页移到 `repair.html`
- [ ] check-i18n 0 缺失；browse 截图 JA/EN、375px
- [ ] Commit

### Task 4: service / facility / security / company / privacy
- [ ] 五个页面按 spec §4/§6；company 的联络人区域先 `hidden`
- [ ] check-i18n；browse 截图
- [ ] Commit

### Task 5: contact 向导
- [ ] 3 步字段按 spec §7，复用 `wizard()`；`data-subject` 双语无关（英文）
- [ ] browse 走通 JA 与 EN 下的逐步校验；不实际提交到 Formspree（避免污染收件箱），用拦截 fetch 验证 payload
- [ ] Commit

### Task 6: 维修子区收编 + 全站检查
- [ ] 维修 5 页 + repair.html：品牌链接→`repair.html`，加「← Robix Data Collection」链接；页脚链接互通
- [ ] 全站 grep：无「拠点がある」类表述、无 ISO、无地点
- [ ] 旧向导（quote/join）仍可前进；更新 README/DEPLOY
- [ ] Commit
