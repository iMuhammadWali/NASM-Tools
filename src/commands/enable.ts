import * as vscode from 'vscode';
import commandExists from 'command-exists';
import { existsSync } from 'fs';
import { join } from 'path';

export async function enableExtension(deactivate: ()=>void) {
	// Check Current OS
	// const os = process.platform;
	// if (os !== 'win32') {
	// 	vscode.window.showErrorMessage('This extension only works on Windows');
	// 	return false;
	// }

	const configs = vscode.workspace.getConfiguration('nasm-tools');

	// Check if NASM Exists
	if (!configs.get('nasmCommand')) {
		// Check if nasm console command exists
		if (commandExists.sync('nasm')) {
			vscode.workspace.getConfiguration('nasm-tools').update('nasmCommand', 'nasm', vscode.ConfigurationTarget.Global);
		} else {
			const choices = [];
			if (commandExists.sync('winget')){
				choices.push('Install NASM Using Winget');
			} 

			const choice = await vscode.window.showInformationMessage('NASM is not installed.', ...choices, 'Disable Extension');
			if (choice === 'Install NASM Using Winget') {
				const terminal = vscode.window.createTerminal('Install NASM');
				terminal.show();
				terminal.sendText('winget install -e --id NASM.NASM -h');
				terminal.sendText('exit');
				// Wait for install to complete
				while (terminal.exitStatus === undefined) {
					await new Promise(resolve => setTimeout(resolve, 500));
				}
				if (existsSync(join(process.env.APPDATA || "/", "../Local/bin/NASM/nasm.exe"))) {
					vscode.workspace.getConfiguration('nasm-tools').update('nasmCommand', join(process.env.APPDATA || "/", "../Local/bin/NASM/nasm.exe"), vscode.ConfigurationTarget.Global);
					vscode.window.showInformationMessage('NASM Installed');
				} else {
					vscode.window.showErrorMessage('Failed to install NASM, NASM Tools Extension not activated.');
					console.log('Failed to install NASM');
					deactivate();
					return false;
				}
			} else {
				console.log('NASM is not installed, NASM Tools Extension not activated.');
				deactivate();
				return false;
			}
		}
	}

	// Check If DOSBOX Exists
	if (!configs.get('dosboxCommand')) {
		// Check if dosbox console command exists
		if (commandExists.sync('dosbox')) {
			vscode.workspace.getConfiguration('nasm-tools').update('dosboxCommand', 'dosbox', vscode.ConfigurationTarget.Global);
		} else if (commandExists.sync('dosbox-x')) {
			vscode.workspace.getConfiguration('nasm-tools').update('dosboxCommand', 'dosbox-x', vscode.ConfigurationTarget.Global);
		} else {
			const choices = [];
			if (commandExists.sync('winget')){
				choices.push('Install DOSBOX-X Using Winget');
			} 
			const choice = await vscode.window.showInformationMessage('DOSBOX or DOSBOX-X is not installed.', ...choices, 'Disable Extension');
			if (choice === 'Install DOSBOX-X Using Winget') {
				const terminal = vscode.window.createTerminal('Install DOSBOX-X');
				terminal.show();
				terminal.sendText('winget install -e --id joncampbell123.DOSBox-X -h');
				terminal.sendText('exit');
				// Wait for install to complete
				while (terminal.exitStatus === undefined) {
					await new Promise(resolve => setTimeout(resolve, 500));
				}
				if (existsSync(join("C:/DOSBOX-X/dosbox-x.exe"))) {
					vscode.workspace.getConfiguration('nasm-tools').update('dosboxCommand', join("C:/DOSBOX-X/dosbox-x.exe"), vscode.ConfigurationTarget.Global);
					vscode.window.showInformationMessage('DOSBOX-X Installed');
				} else {
					vscode.window.showErrorMessage('Failed to install DOSBOX-X, NASM Tools Extension not activated.');
					console.log('Failed to install DOSBOX-X');
					deactivate();
					return false;
				}
			} else {
				console.log('DOSBOX-X or DOSBOX is not installed, NASM Tools Extension not activated.');
				deactivate();
				return false;
			}
		}
	}
	vscode.window.showInformationMessage('NASM Tools Extension Activated');
	console.log(configs.get('nasmCommand'));
	console.log(configs.get('dosboxCommand'));
	return true;
}
