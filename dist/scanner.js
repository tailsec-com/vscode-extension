"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanFile = scanFile;
exports.scanWorkspace = scanWorkspace;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const SCANNERS = ['k8s', 'terraform', 'docker', 'secrets', 'deps', 'license'];
async function scanFile(uri) {
    const ext = path.extname(uri.fsPath);
    const scanner = detectScanner(ext);
    if (!scanner)
        return [];
    try {
        const output = (0, child_process_1.execSync)(`npx @tailsec/scan-${scanner} ${uri.fsPath} --format json`, { encoding: 'utf-8', timeout: 30000 });
        return parseFindings(JSON.parse(output), uri.fsPath);
    }
    catch {
        return [];
    }
}
async function scanWorkspace() {
    const allFindings = [];
    for (const scanner of SCANNERS) {
        try {
            const output = (0, child_process_1.execSync)(`npx @tailsec/scan-${scanner} . --format json`, { encoding: 'utf-8', timeout: 60000 });
            const parsed = JSON.parse(output);
            allFindings.push(...parseFindings(parsed, '.'));
        }
        catch {
            // Scanner may not apply
        }
    }
    return allFindings;
}
function detectScanner(ext) {
    const map = {
        '.yaml': 'k8s', '.yml': 'k8s',
        '.tf': 'terraform',
        'Dockerfile': 'docker',
    };
    return map[ext] || null;
}
function parseFindings(output, basePath) {
    const findings = [];
    const categories = Object.keys(output).filter(k => k !== 'summary');
    for (const category of categories) {
        for (const item of output[category] || []) {
            findings.push({
                ruleId: item.ruleId || item.id || 'unknown',
                severity: item.severity || 'medium',
                title: item.title || item.name || 'Security finding',
                file: item.file || basePath,
                line: item.line || 1,
                message: item.message || item.description || ''
            });
        }
    }
    return findings;
}
//# sourceMappingURL=scanner.js.map