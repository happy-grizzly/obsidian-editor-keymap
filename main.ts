import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'navigate-to-next-character',
			name: 'Navigate to next character',
			editorCallback: (editor: Editor) => {

				function code(): void {
					navNextChar(editor)
				}

				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'navigate-to-previous-character',
			name: 'Navigate to previous character',
			editorCallback: (editor: Editor) => {

				function code(): void {
					navPrevChar(editor)
				}

				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'navigate-to-next-word',
			name: 'Navigate to next word',
			editorCallback: (editor: Editor) => {

				function code(): void {

					var cursorLocationBefore;
					var cursorLocationAfter;
					var inBetween;
					var isWhiteSpaceAllowed = true;
					var isFirstRun = true;

					cursorLocationBefore = editor.getCursor();
					navNextChar(editor);
					cursorLocationAfter = editor.getCursor();

					inBetween = editor.getRange(cursorLocationBefore, cursorLocationAfter)
					do {
						cursorLocationBefore = editor.getCursor();
						navNextChar(editor);
						cursorLocationAfter = editor.getCursor();

						inBetween = editor.getRange(cursorLocationBefore, acursorLocationBefore)

						if (isWhiteSpaceAllowed && inBetween != ' ') isWhiteSpaceAllowed = false;
						else if (!isWhiteSpaceAllowed && inBetween == ' ') break;

					} while ( !hasSpecialsChars( inBetween ) || !(isFirstRun = false))

					navPrevChar(editor);
				}

				repeatUntilKeyUp(code, this)
			}
		});

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// global functions

function hasSpecialsChars(char: string): boolean {

	switch(char) {
		case '!':
			return true

		case '@':
			return true

		case '#':
			return true

		case '$':
			return true

		case '%':
			return true

		case '^':
			return true

		case '&':
			return true

		case '*':
			return true

		case '(':
			return true

		case ')':
			return true

		case '_':
			return true

		case '-':
			return true

		case '+':
			return true

		case '=':
			return true

		case "\\":
			return true

		case '|':
			return true

		case '}':
			return true

		case '{':
			return true

		case ']':
			return true

		case '[':
			return true

		case '"':
			return true

		case "'":
			return true

		case ';':
			return true

		case ':':
			return true

		case '/':
			return true

		case '?':
			return true

		case '>':
			return true

		case '<':
			return true

		case '.':
			return true

		case ',':
			return true

		case '`':
			return true

		case '~':
			return true
	}

	return false;
}

function navPrevChar(editor: Editor) {

	let cursorLocationBefore = editor.getCursor()

	if (editor.getCursor().ch == 0) {

		editor.setCursor( cursorLocationBefore.line - 1, editor.getLine(cursorLocationBefore.line - 1).length )

	} else {

		editor.setCursor( cursorLocationBefore.line, cursorLocationBefore.ch - 1 );
	}
}

function navNextChar(editor: Editor) {

	let cursorLocationBefore = editor.getCursor()
	editor.setCursor( cursorLocationBefore.line, cursorLocationBefore.ch + 1 );
}

async function delay(ms: number) {

	return new Promise( resolve => setTimeout(resolve, ms) );
}

async function repeatUntilKeyUp(code: Function, context: Plugin) {

	let yes = true

	context.registerDomEvent(document, 'keyup', () => {

		yes = false;
	})

	code()
	await delay(500)
	let count = 0
	while (yes) {
		await delay(30)
		code()
		count++
	}
}
