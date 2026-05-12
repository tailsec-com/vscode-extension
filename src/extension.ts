import * as vscode from 'vscode';
import { scanFile, scanWorkspace } from './scanner';
import { FindingsProvider } from './findings';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext) {
    const findingsProvider = new FindingsProvider();
    vscode.window.registerTreeDataProvider('tailsecFindings', findingsProvider);

    registerCommands(context, findingsProvider);
}

export function deactivate() {}