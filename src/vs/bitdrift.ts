/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { init, SessionStrategy } from '@bitdrift/electron';
import { validatedIpcMain } from './base/parts/ipc/electron-main/ipcMain.js';

export const Logger = init(
	process.env.BITDRIFT_KEY ?? 'unknown key',
	SessionStrategy.Fixed,
	{
		url: 'api.bitdrift.dev',
		appVersion: '1.98.0',
	}
);

validatedIpcMain.on('vscode:bitdrift:log', (_, level, message, fields) => {
	console.log(
		`Renderer sending log level: ${level} message: ${message} with fields: ${JSON.stringify(
			fields
		)}`
	);
	Logger.log(level, message, fields ?? {});
});

const createBufferFromArray = (data: [number, number, number, number, number][]): ArrayBuffer => {
	const totalSize = data.length * 9; // 5 numbers per tuple

	const buffer = new ArrayBuffer(totalSize);
	const dataView = new DataView(buffer);

	let offset = 0;

	for (const [type, x, y, width, height] of data) {
		const typeWithMask = type | 0b11110000;
		dataView.setInt8(offset, typeWithMask);
		offset += 1;
		dataView.setInt16(offset, x, false);
		offset += 2;
		dataView.setInt16(offset, y, false);
		offset += 2;
		dataView.setInt16(offset, width, false);
		offset += 2;
		dataView.setInt16(offset, height, false);
		offset += 2;
	}

	return buffer;
};


validatedIpcMain.on('vscode:bitdrift:replay', (_, screen: [number, number, number, number, number][]) => {
	const screenBuffer = createBufferFromArray(screen);
	Logger.log(2, 'Screen captured', { log_type: 1, screen: Buffer.from(screenBuffer) });
});
