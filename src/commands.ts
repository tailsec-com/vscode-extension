import * as vscode from 'vscode';
import { scanFile, scanWorkspace } from './scanner';
import { FindingsProvider } from './findings';

export function registerCommands(context: vscode.ExtensionContext, provider: FindingsProvider) {
    context.subscriptions.push(
        vscode.commands.registerCommand('tailsec.scan', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            vscode.window.showInformationMessage('Running Tailsec scan...');
            const findings = await scanFile(editor.document.uri);
            provider.updateFindings(findings);
            vscode.window.showInformationMessage(`Found ${findings.length} issues`);
        }),

        vscode.commands.registerCommand('tailsec.scanWorkspace', async () => {
            vscode.window.showInformationMessage('Scanning workspace with Tailsec...');
            const findings = await scanWorkspace();
            provider.updateFindings(findings);
            vscode.window.showInformationMessage(`Found ${findings.length} issues`);
        })
    );
}