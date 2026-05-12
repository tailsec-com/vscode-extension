import * as vscode from 'vscode';
import { Finding } from './scanner';

export class CodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const lenses: vscode.CodeLens[] = [];
        return lenses;
    }
}