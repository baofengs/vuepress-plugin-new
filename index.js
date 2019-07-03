const { join } = require('path');
const { fs, logger, chalk } = require('@vuepress/shared-utils');
const { red } = chalk;
const fse = require('fs-extra');

module.exports = (opts = {}, ctx) => ({
    name: 'vuepress-plugin-new',

    chainWebpack(config) {
        config.plugins.delete('bar')
        config.plugins.delete('vuepress-log')
    },

    extendCli(cli) {
        cli
            .command('new [targetDir] <file-name>', 'new post')
            .alias('n', 'new post')
            .option('-d, --draft', 'is draft')
            .allowUnknownOptions()
            .action(async (dir = '.', fileName, options) => {
                const [valid, err] = validate(fileName);
                if (!valid) {
                    logger.error(err.message);
                    process.exit(-1);
                }
                try {
                    logger.setOptions({ logLevel: 3 });
                    const base = (opts.base === '/' ? '.' : opts.base) || '.';
                    const post = new PostFile({
                        dir: join(process.cwd(), dir, base),
                        base,
                        file: fileName,
                        opt: options
                    });
                    post.info().rename().touch().done();
                    process.exit(0);
                } catch (e) {
                    throw e
                }
            });
    }
});

function validate(fileName) {
    let validInfo = [true];
    if (!fileName) {
        validInfo = [false, new Error(`missing required arg ${red('<file-name>')} for command 'new [targetDir] <file-name>'`)];
    } else if (!fileName.split('/').slice(-1)[0]) {
        validInfo = [false, new Error('No file-name found, only a path has given')];
    }
    return validInfo;
}

class PostFile {
    constructor({ dir, base, file, opt }) {
        this.dir = dir;
        this.base = base;
        this.file = file;
        this.isDraft = opt.draft && opt.d;
        this.postStr = this.isDraft ? 'draft' : 'post';
    }

    info() {
        logger.info(`Creating new ${this.postStr}...\n`);
        return this;
    }

    rename() {
        let fileName = this.file.split(' ').filter(name => name).join('-');
        if (fileName.indexOf('/') === -1) {
            const path = new Date().getFullYear();
            fileName = `${path}/${fileName.trim('/')}`;
        }
        this.file = this._rename(fileName);
        return this;
    }

    touch() {
        const title = this._getLastItemOf(this.file.split('/')).split('-').join(' ');
        const draft = this.isDraft ? 'draft: true\n' : '';
        const dateStr = (new Date()).toLocaleString();
        const frontmatterStr = `---\ntitle: ${title}\n${draft}date: '${dateStr}'\n---`;
        fse.outputFileSync(`${join(this.dir, this.file)}.md`, frontmatterStr, 'utf8');
        return this;
    }

    done() {
        process.stdout.write("\n")
        logger.info(`done\t ${join(this.base, this.file)}.md`);
        logger.info(`preview\t /${join(this.base, this.file)}.html\n`);
    }

    _exists(file) {
        try {
            fs.accessSync(`${join(this.dir, file)}.md`);
            return true;
        } catch (e) {
            return false;
        }
    }

    _notExists(file) {
        return !this._exists(file);
    }

    _isNotNumber(num) {
        return Object.prototype.toString.call(num) !== '[object Number]';
    }

    _getFileIndex (file) {
        const resArr = file.match(/-(\d+)$/);
        return resArr ? resArr[1] : '';
    }

    _replaceFileIndex (file, index) {
        return file.replace(/(\d+)$/, index);
    }

    _rename(file) {
        if (this._notExists(file)) {
            return file;
        }
        logger.warn(`${this._resolveNameOf(file)}.md was existed`);
        let index = this._getFileIndex(file);
        file = index ? this._replaceFileIndex(file, ++index) : `${file}-1`;
        return this._rename(file);
    }

    _getLastItemOf(arr) {
        return arr.length === 1 ? '' : arr.slice(-1)[0];
    }

    _resolveNameOf(file) {
        return this._getLastItemOf(file.split('/'));
    }
}
