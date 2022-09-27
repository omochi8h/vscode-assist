import * as vscode from 'vscode';
// import { PythonShell } from 'python-shell';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("../assist.sqlite3");
console.log(db);


//Import PythonShell module.
const { PythonShell } = require('python-shell');

// var options = {
// 	mode: 'text', // textもしくはjson
// 	pythonPath: 'path/to/python', // Python3のパスを指定しないと動かないので注意
// 	pythonOptions: ['-u'],
// };

// console.log(PythonShell);
// nodejsとpythonの連携がうまくいかない
// @ts-ignore
PythonShell.run('assist_python/my_script.py', null, function (err) {
	if (err) {
		console.log('finished');
		console.log(err);
	} else {
		console.log('python-OK');
	}

});

db.serialize(() => {
    // db.run("drop table if exists tries");
    // db.run("create table if not exists tries(content)");
    // db.run("insert into tries(content) values(?)", "いっこめ");
    // db.run("insert into tries(content) values(?)", "にこめ");
	// // @ts-ignore
	// db.get('SELECT content FROM tries', function(err, row) {
	// 	if (err) {
	// 		console.log(err);
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

			//ソースコードのn-1行目を取得する
			let line1 = text.split(/\r\n|\r|\n/)[0];
			let line2 = text.split(/\r\n|\r|\n/)[1];

			

			// db.run('INSERT INTO tries (content) VALUES (?)', 'できてるかなあ');
			// let content :string = "";
			// content = db.get('SELECT content FROM tries where id=1');
			// vscode.window.showInformationMessage(`contentは${content}`);
			// console.log(content);

			db.serialize(() => {

				db.run("insert into student(student_name,student_number) values(?,?)", line1,line2);

				// db.run("insert into tries(content) values(?)", text);
				// @ts-ignore
				// db.get('SELECT content FROM tries', function(err, row) {
				// 	if (err) {
				// 		console.log(err)
				// 	}
				// 	console.log(row.content);
				// 	console.log('できてる？');
				// });
				db.each("select * from student", (err, row) => {
					if (err) {
						console.log(err);
					}
					console.log(`${row.student_number}`);
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

