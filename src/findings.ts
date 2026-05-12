import * as vscode from 'vscode';
import { Finding } from './scanner';

export class FindingsProvider implements vscode.TreeDataProvider<FindingItem> {
    private findings: Finding[] = [];

    getTreeItem(element: FindingItem): vscode.TreeItem {
        const item = new vscode.TreeItem(element.finding.title);
        item.collapsibleState = vscode.TreeItemCollapsibleState.None;
        return item;
    }

    getChildren(): FindingItem[] {
        return this.findings.map(f => new FindingItem(f));
    }

    updateFindings(findings: Finding[]) {
        this.findings = findings;
    }
}

class FindingItem {
    constructor(public finding: Finding) {}
}