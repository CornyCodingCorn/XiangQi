import * as React from "react";
import fs from "fs";
import { staticImplements, IStaticInit } from "../interfaces/StaticInit";
import { getAllPaths as getAllPiecePaths } from "./pieces/Index";

@staticImplements<IStaticInit<() => void, void>>()
export default class ImagesCollection {
	private static _collection: Map<String, HTMLImageElement> = new Map<
		String,
		HTMLImageElement
	>();
	private static _inited = false;
	public static get inited(): boolean {
		return this._inited;
	}

	public static getImage(src: String): HTMLImageElement | null {
		return this._collection.get(src) || null;
	}

	public static async init(fn?: () => void) {
		if (this._inited) return;

		await this._createImages(getAllPiecePaths());

		this._inited = true;
		if (fn !== undefined) {
			fn();
		}

		return Promise.resolve();
	}

	private static async _createImages(files: string[]) {
		let promises: Promise<void>[] = [];

		files.forEach((value) => {
			let newPromise = new Promise<void>((resolve, reject) => {
				if (this._getExtension(value) !== "png") return;

				let img = new Image();

				img.onload = () => {
					resolve();
				};
				img.src = value;

				ImagesCollection._collection.set(value, img);
			});
			promises.push(newPromise);
		});

		return Promise.all(promises);
	}

	private static _getExtension(filePath: string): string {
		const re = /(?:\.([^.]+))?$/;
		var result = re.exec(filePath);
		if (result === null) return "";
		return result[1] || "";
	}
}
