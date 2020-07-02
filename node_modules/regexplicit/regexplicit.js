"use strict";

(function codenautasModuleDefinition(root, name, factory) {
    /* global define */
    /* istanbul ignore next */
    if(typeof root.globalModuleName !== 'string'){
        root.globalModuleName = name;
    }
    /* istanbul ignore next */
    if(typeof exports === 'object' && typeof module === 'object'){
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
        define(factory);
    }else if(typeof exports === 'object'){
        exports[root.globalModuleName] = factory();
    }else{
        root[root.globalModuleName] = factory();
    }
    root.globalModuleName = null;
})(/*jshint -W040 */this, 'Regexplicit', function() {
/*jshint +W040 */

/*jshint -W004 */
var Regexplicit = {};
/*jshint +W004 */

/// EN GENERAL
/// Salvo que se indique lo contrario todos los regexp tienen la forma izquierda, detectado, derecha
/// cuando dice ISSUE: no reconoce string significa que puede identificar cosas dentro de un string como si fueran otra cosa.

/// DESCRIPCIÓN: identificar nombre de variables en una expresión distingiuéndolas de nombres de funciones
/// ISSUES: no reconoce strings, ni comentarios
/// USO: directo
Regexplicit.variables = /(\b)([A-Za-z_]\w*)(?!\s*\()(\b)/g;
Regexplicit.variables.replacer = replacer;

/// DESCRIPCIÓN: identificar el operador = para poder reemplazarlo por ==, logra distinguir el = de un != >= == etc. 
/// ISSUES: no reconoce strings, ni comentarios
/// USO: detecta izquierda, operador(=), derecha
Regexplicit.operatorEqual = /(^|[^!><=])(=)($|[^=])/g;
Regexplicit.operatorEqual.replacer = replacer;


/// DESCRIPCIÓN: identificar un trimestre (quarter) en números arábigos o romanos
/// USO: detecta 1: año, 2: trimestre, 3: 1er trimestre en romano, 4: 2do trimestre en romano, etc
Regexplicit.yearTrim = /^\s*(\d\d+)\s*(?:(?:q|t|tr|tri|trim[a-z]*)\s*([1-4])|(?:[-/]?)\s*(?:(I)|(II)|(III)|(IV))\.?)\s*$/i;

/// DESCRIPCIÓN: identificar un trimestre (quarter) en números arábigos o romanos
/// USO: detecta como yearTrim pero el año al final
Regexplicit.trimYear = /^\s*(?:([1-4])\s*(?:q|t|tr|tri|trim[a-z]*)|(?:(I)|(II)|(III)|(IV))\.?\s*(?:[-/]?))\s*(\d\d+)\s*$/i;


/// DESCRIPCIÓN: identificar un semestre en números arábigos o romanos
/// USO: detecta 1: año, 2: trimestre, 3: 1er trimestre en romano, 4: 2do trimestre en romano, etc
Regexplicit.yearSem = /^\s*(\d\d+)\s*(?:s|sem[a-z]*)\s*(?:([1-4])|(I)|(II))\s*$/i;

/// DESCRIPCIÓN: identificar un semestre en números arábigos o romanos
/// USO: detecta como yearTrim pero el año al final
Regexplicit.semYear = /^\s*(?:([1-4])|(I)|(II))\s*(?:s|sem[a-z]*)\s*(\d\d+)\s*$/i;

Regexplicit.detectUrlWithoutResources = /^([^?#]*\/)*[^./?#]*([?#].*)?$/;
Regexplicit.detectNonEmptyUrlWithoutResources = /^([^?#]*\/)*[^./?#]+([?#].*)?$/;

function replacer(string, detectedReplacer){
    return string.replace(this, function(match, left, detected, right){
        return left+(typeof detectedReplacer === 'string'?detectedReplacer:detectedReplacer(detected))+right;
    });
}

return Regexplicit;

});