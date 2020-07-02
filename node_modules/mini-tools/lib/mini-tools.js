"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const url = require("url");
const fs = require("fs-extra");
const jsYaml = require("js-yaml");
const readYaml = require("read-yaml-promise");
const bestGlobals = require("best-globals");
const best_globals_1 = require("best-globals");
const send = require("send");
/* tslint:disable:no-object-literal-type-assertion */
exports.globalOpts = {
    serveErr: {
        propertiesWhiteList: ['code'],
        sendStack: false
    },
    logServe: false,
    readConfig: {
        exts: {
            ".yaml": readYaml,
            ".yml": readYaml,
            ".json": fs.readJson.bind(fs),
        }
    }
};
/* tslint:enable:no-object-literal-type-assertion */
function serveErr(_req, res, next) {
    return async function (err) {
        if (err.message === 'next') {
            return next();
        }
        console.log('ERROR', err);
        console.log('STACK', err.stack);
        let text = 'ERROR' + (err.code ? ' ' + err.code : '') + ': ' + err.message;
        exports.globalOpts.serveErr.propertiesWhiteList.forEach(function (attrName) {
            if (attrName in err) {
                text += '\n' + attrName + ': ' + JSON.stringify(err[attrName]);
            }
        });
        if (exports.globalOpts.serveErr.sendStack) {
            text += '\n------------------\n' + err.stack;
        }
        if (!res.headersSent) {
            let buf = new Buffer(text);
            let length = buf.length;
            res.writeHead(err.status || 400, {
                'Content-Length': length,
                'Content-Type': 'text/plain; charset=utf-8'
            });
        }
        else {
            text += "\n</script>\n<pre>\n------------------------------------\n" + text;
        }
        res.end(text);
    };
}
exports.serveErr = serveErr;
;
function preEval(expresion, vars, functions) {
    var r = /\b([a-zA-Z_]+)(\s*\()?/;
    var ok = true;
    expresion.replace(r, function (_, name, isFun) {
        if (!(isFun ? functions : vars)[name]) {
            ok = false; // may be throw Exception
        }
        return "";
    });
    return ok;
}
exports.preEval = preEval;
;
function serveText(htmlText, contentTypeText) {
    return function (req, res) {
        let ct = (contentTypeText || 'plain').replace(/^(.*\/)?([^\/]+)$/, function (phrase, first, second) {
            return (first || 'text/') + second;
        });
        res.setHeader('Content-Type', ct + '; charset=utf-8');
        let buf = new Buffer(htmlText);
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
    };
}
exports.serveText = serveText;
;
function serveFile(fileName, options) {
    return function (req, res) {
        send(req, fileName, options || {}).pipe(res);
    };
}
exports.serveFile = serveFile;
;
function escapeRegExp(string) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
exports.escapeRegExp = escapeRegExp;
/* istanbul ignore next */
function getTraceroute() {
    try {
        throw new Error('aca estamos');
    }
    catch (err) {
        return err.stack.split('\n')[4];
    }
}
exports.getTraceroute = getTraceroute;
function serveTransforming(pathToFile, anyFileOrOptions, extOriginal, extTarget, renderizer, textType) {
    let regExpExtDetect;
    let regExpExtReplace;
    let anyFile;
    var renderOptions = null;
    if (typeof anyFileOrOptions === "boolean") {
        anyFile = anyFileOrOptions;
    }
    else if (anyFileOrOptions == null) {
        /* istanbul ignore next */
        anyFile = null;
    }
    else {
        anyFile = anyFileOrOptions.anyFile;
        renderOptions = best_globals_1.changing(anyFileOrOptions, { anyFile: undefined }, best_globals_1.changing.options({ deletingValue: undefined }));
        extOriginal = anyFileOrOptions.extOriginal || extOriginal;
    }
    /* istanbul ignore next */
    let traceRoute = renderOptions && renderOptions.trace ? 'serveContent>' + renderOptions.trace : (exports.globalOpts.logServe ? getTraceroute() : '');
    if (extOriginal) {
        regExpExtDetect = new RegExp('\.' + escapeRegExp(extOriginal) + '$');
        regExpExtReplace = new RegExp('\.' + escapeRegExp(extOriginal) + '$', 'g');
    }
    else {
        regExpExtDetect = /^(.*\/)?[^\/\.]+$/;
        regExpExtReplace = /$/g;
    }
    return function (req, res, next) {
        async function unchainedFunction() {
            try {
                let pathname = ('path' in req /*never*/ ? req.path : url.parse(req.url).pathname);
                /* istanbul ignore next */
                if (traceRoute) {
                    console.log('xxxxx-minitools-por-revisar', traceRoute, pathname);
                }
                if (anyFile && !regExpExtDetect.test(pathname)) {
                    return next();
                }
                var sfn;
                var fileContent;
                try {
                    let fileName = (pathToFile + (anyFile ? '/' + pathname : '')).replace(regExpExtReplace, '.' + extTarget);
                    sfn = fileName;
                    fileContent = await fs.readFile(fileName, { encoding: 'utf8' });
                }
                catch (err) {
                    if (anyFile && err.code === 'ENOENT') {
                        /* istanbul ignore next */
                        if (traceRoute) {
                            console.log('xxxxx-minitools: no encontre el archivo', traceRoute, pathname);
                        }
                        throw new Error('next');
                    }
                    throw err;
                }
                let args = [fileContent];
                if (renderOptions !== undefined) {
                    args.push(renderOptions);
                }
                let htmlText = await renderizer.render.apply(renderizer, args);
                /* istanbul ignore next */
                if (traceRoute) {
                    console.log('XXXXXXXX!!!!-xxxxx-minitools: ENVIANDO el archivo', traceRoute, pathname);
                }
                serveText(htmlText, textType)(req, res);
            }
            catch (err) {
                await serveErr(req, res, next)(err);
            }
        }
        void unchainedFunction();
    };
}
;
function serveStylus(pathToFile, anyFile) {
    /*eslint global-require: 0*/
    return serveTransforming(pathToFile, anyFile, 'css', 'styl', require('stylus'), 'css');
}
exports.serveStylus = serveStylus;
function serveJade(pathToFile, anyFileOrOptions) {
    /*eslint global-require: 0*/
    return serveTransforming(pathToFile, anyFileOrOptions, '', 'jade', require('pug'), 'html');
}
exports.serveJade = serveJade;
function serveJson(object) {
    return serveText(JSON.stringify(object), 'application/json');
}
exports.serveJson = serveJson;
;
function serveYaml(object) {
    return serveText(jsYaml.safeDump(object), 'application/x-yaml');
}
exports.serveYaml = serveYaml;
;
async function readConfig(listOfFileNamesOrConfigObjects, opts = {}) {
    let listOfConfig = await Promise.all(listOfFileNamesOrConfigObjects.map(async function (fileNameOrObject) {
        let result;
        if (typeof fileNameOrObject === "string") {
            let ext = Path.extname(fileNameOrObject);
            let exts;
            if (ext) {
                fileNameOrObject = fileNameOrObject.substr(0, fileNameOrObject.length - ext.length);
                exts = [ext];
            }
            else {
                exts = Object.keys(exports.globalOpts.readConfig.exts);
            }
            async function searchFileName() {
                if (exts.length) {
                    // TODO: algún día esto no va a ser necesario porque van a implementar los arreglos compactos!
                    var ext = exts.shift();
                    try {
                        await fs.access(fileNameOrObject + ext, fs.constants.R_OK);
                        return { ext: ext, fileName: fileNameOrObject + ext };
                    }
                    catch (err) {
                        return searchFileName();
                    }
                }
                else {
                    if (opts.whenNotExist === 'ignore') {
                        return { empty: true };
                    }
                    else {
                        throw new Error('Config file does not found ' + fileNameOrObject);
                    }
                }
            }
            result = await searchFileName();
            if ('empty' in result) {
                return {};
            }
            else {
                return exports.globalOpts.readConfig.exts[result.ext](result.fileName);
            }
        }
        else if (typeof fileNameOrObject === "object" && !(fileNameOrObject instanceof Array)) {
            return fileNameOrObject;
        }
        else {
            throw new Error("readConfig must receive string filename or config object");
        }
    }));
    return listOfConfig.reduce(function (acumConfig, oneConfig) {
        return bestGlobals.changing(acumConfig, oneConfig);
    }, {});
}
exports.readConfig = readConfig;
;
//# sourceMappingURL=mini-tools.js.map