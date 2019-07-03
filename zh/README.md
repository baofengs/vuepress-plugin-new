# vuepress-plugin-new

> This plugin requires VuePress >= **1.0.0**.

Vuepress 的命令行扩展工具，用以快速的创建文章，就像 `hexo new 'hello world'`

## Features

- 在当前目录下创建文章的 markdown 文件
- 在文件中自动插入基本 frontmatter 配置
- 支持创建草稿
- 自动处理重名文件

## Install

```bash
npm i vuepress-plugin-new
```

## Usage

### 使用扩展:

```js
// .vuepress/config.js
module.exports = {
    plugins: [
        'vuepress-plugin-export',
        {
            base: '_post'
        }
    ]
}
```

### 运行:

新建一个名为 *hello vuepress* 的文章

```bash
vuepress new . 'hello vuepress'
```

新建一个名为 *hello vuepress latter* 的草稿

```bash
vuepress new . 'hello vuepress latter' -d/--draft
```

## 选项

base

- Type: string
- Default: '.'

指定文章所在的目录


## 开发

```bash
git clone https://github.com/x-bao/vuepress-plugin-new
cd vuepress-plugin-new
yarn
```

## 贡献

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :P


## Author

**vuepress-plugin-new** © [San Baofeng](https://github.com/x-bao), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by San Baofeng

> [San Baofeng's](https://arts.sanbaofengs.com) · GitHub [@San Baofeng](https://github.com/x-bao) · Twitter [@Baofeng15](https://twitter.com/Baofeng15)
