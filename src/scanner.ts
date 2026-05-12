import { execSync } from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

export interface Finding {
    ruleId: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    file: string;
    line: number;
    message: string;
}

const SCANNERS = ['k8s', 'terraform', 'docker', 'secrets', 'deps', 'license'];

export async function scanFile(uri: vscode.Uri): Promise<Finding[]> {
    const ext = path.extname(uri.fsPath);
    const scanner = detectScanner(ext);
    if (!scanner) return [];

    try {
        const output = execSync(
            `npx @tailsec/scan-${scanner} ${uri.fsPath} --format json`,
            { encoding: 'utf-8', timeout: 30000 }
        );
        return parseFindings(JSON.parse(output), uri.fsPath);
    } catch {
        return [];
    }
}

export async function scanWorkspace(): Promise<Finding[]> {
    const allFindings: Finding[] = [];

    for (const scanner of SCANNERS) {
        try {
            const output = execSync(
                `npx @tailsec/scan-${scanner} . --format json`,
                { encoding: 'utf-8', timeout: 60000 }
            );
            const parsed = JSON.parse(output);
            allFindings.push(...parseFindings(parsed, '.'));
        } catch {
            // Scanner may not apply
        }
    }

    return allFindings;
}

function detectScanner(ext: string): string | null {
    const map: Record<string, string> = {
        '.yaml': 'k8s', '.yml': 'k8s',
        '.tf': 'terraform',
        'Dockerfile': 'docker',
    };
    return map[ext] || null;
}

function parseFindings(output: any, basePath: string): Finding[] {
    const findings: Finding[] = [];
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