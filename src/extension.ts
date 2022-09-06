import * as vscode from 'vscode';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("../assist.sqlite3");
console.log(db);

db.serialize(() => {
    // db.run("drop table if exists tries");
    // db.run("create table if not exists tries(content)");
    // db.run("insert into tries(content) values(?)", "いっこめ");
    // db.run("insert into tries(content) values(?)", "にこめ");
	//@ts-ignore
	// db.get('SELECT content FROM tries', function(err, row) {
	// 	if (err) {
	// 		console.log(err)
	// 	}
	// 	console.log(row.content);
	// 	console.log('できてる？');
	// });

});

// db.close();


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('assistsystem.assist', async () => {

			let activeEditor = vscode.window.activeTextEditor;
			let text :string = "";
			if (activeEditor){
			  text = activeEditor.document.getText();
			}
			vscode.window.showInformationMessage(`textは${text}`);

			// db.run('INSERT INTO tries (content) VALUES (?)', 'できてるかなあ');
			// let content :string = "";
			// content = db.get('SELECT content FROM tries where id=1');
			// vscode.window.showInformationMessage(`contentは${content}`);
			// console.log(content);

			db.serialize(() => {

				db.run("insert into tries(content) values(?)", text);
				// @ts-ignore
				// db.get('SELECT content FROM tries', function(err, row) {
				// 	if (err) {
				// 		console.log(err)
				// 	}
				// 	console.log(row.content);
				// 	console.log('できてる？');
				// });
				db.each("select * from tries", (err, row) => {
					if (err) {
						console.log(err)
					}
					console.log(`${row.content}`);
				});

			});
			
		})
	);
	
	const button = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right, 
		0
	);
	button.command = 'assistsystem.assist';
	button.text = 'コンパイル時押してね！';
	context.subscriptions.push(button);
	button.show();
}

