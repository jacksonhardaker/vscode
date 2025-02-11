/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { init, SessionStrategy } from '@bitdrift/electron';
// import { validatedIpcMain } from './base/parts/ipc/electron-main/ipcMain.js';

export const Logger = init(
	process.env.BITDRIFT_KEY ?? 'unknown key',
	SessionStrategy.Fixed,
	{
		url: 'api.bitdrift.dev',
		appVersion: '1.98.0',
		autoAddMainListener: {
			channelPrefix: 'vscode',
			experimental: {
				sessionReplayEnabled: true
			}
		}
	},
);
