# AI 生图工作流

本项目已经内置本地批量生图脚本，可直接读取 `docs/character-image-prompts/character-prompts.md` 中的角色 prompt，并调用 Google Gemini 图像模型生成 PNG。

## 1. 准备 API Key

在当前终端设置：

```powershell
$env:GOOGLE_API_KEY="你的 Google AI Studio Key"
```

也兼容：

```powershell
$env:GEMINI_API_KEY="你的 Google AI Studio Key"
```

Key 可在 Google AI Studio 获取：
https://aistudio.google.com/apikey

## 2. 先 dry-run 检查解析

```powershell
pnpm gen:images -- --dry-run
```

只看某几个人格：

```powershell
pnpm gen:images -- --codes FAKE,DEAD,ATM-er --dry-run
```

## 3. 生成图片

默认模型：`gemini-2.5-flash-image`

```powershell
pnpm gen:images
```

只跑一个人格：

```powershell
pnpm gen:images -- --code FAKE
```

跑多个重点人格：

```powershell
pnpm gen:images -- --codes FAKE,FUCK,SHIT,ATM-er,THAN-K
```

跑某个人格的全部变体：

```powershell
pnpm gen:images -- --code FAKE --variant all
```

切换模型：

```powershell
pnpm gen:images -- --model gemini-2.5-flash-image
```

## 4. 输出位置

脚本默认输出到：

```text
generated/personality-images/
```

并同步生成：

```text
generated/personality-images/manifest.json
```

建议流程：

1. 先输出到 `generated/personality-images/`
2. 人工挑图
3. 满意后再复制到 `public/personality-images/`
4. 文件名按现有规范保持一致

## 5. 常用参数

- `--code <CODE>`：只生成一个人格
- `--codes <A,B,C>`：生成多个 code
- `--variant main|all|A|B|C`：选择主 prompt 或变体
- `--model <MODEL>`：指定模型
- `--out <DIR>`：改输出目录
- `--manifest <FILE>`：改 manifest 路径
- `--delay-ms <N>`：请求间隔，默认 `1200`
- `--overwrite`：覆盖已有图片
- `--dry-run`：只解析，不调用 API
- `--manifest-only`：只写 manifest，不生图

## 6. 命名规则

命名与站点运行时规则一致：

- `ATM-er -> atm-er.png`
- `LOVE-R -> love-r.png`
- `WOC! -> woc.png`

如果使用 `--variant all`，脚本会输出：

- `fake.png`
- `fake.a.png`
- `fake.b.png`

最终正式放进站点的文件，仍建议只保留主版本文件名，例如 `fake.png`。

## 7. 注意事项

- 脚本默认不会覆盖已存在图片，除非带 `--overwrite`
- 没有图片时，网站仍会继续使用 SVG fallback
- 如果模型没有返回图片，脚本会直接报错并退出
- 批量跑之前，建议先用 `FAKE / FUCK / SHIT / ATM-er / THAN-K` 小批量试风格