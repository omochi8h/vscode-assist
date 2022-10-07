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
			// 先頭から2文字を削除
			let number = line1.slice(2);
			let name = line2.slice(2);
			
			// input.cに解答プログラムの書き込み.例のごとくC:\Users\stude\AppData\Local\Programs\Microsoft VS Codeに置かれてしまう．
			// @ts-ignore
			const removeHeads = (s, n) => s.split('\n').slice(n).join('\n')
			text = removeHeads(text, 2)
			const fs = require("fs");
			const data = text;
			// @ts-ignore
			fs.writeFile("input.c", data, (err) => {
			if (err) throw err;
				console.log('正常に書き込みが完了しました');
			});
			//時間取得
			const moment = require('moment');
			const currentTime = moment();
			console.log(currentTime.format("YYYYMMDDHHmmss"));
			

			// db.run('INSERT INTO tries (content) VALUES (?)', 'できてるかなあ');
			// let content :string = "";
			// content = db.get('SELECT content FROM tries where id=1');
			// vscode.window.showInformationMessage(`contentは${content}`);
			// console.log(content);

			db.serialize(() => {

				//studentテーブル内にline2と同じものが存在していなければ，studentテーブルへ書き込む（新規登録）
				let number_flag = 0;
				let id = 0;
				// @ts-ignore
				db.each("select * from student", (err, row) => {
					if (err) {
						console.log(err);
					}
					if (number==row.student_number){
						number_flag = 1;
						id = row.student_id;
						console.log('OK!!');
					}
					console.log(`numberは${number}`);
					console.log(`studentは${row.student_number}`);
					console.log(`idは${row.student_id}`);
				});

				if(number_flag==1){
					//line2=student_numberとなるデータを抽出，student_idを取得するプログラム
					console.log(`追加しません`);
				}else{
					// @ts-ignore
					connection.query("insert into student(student_name,student_number) values(?,?)", name,number, function(err, result) {
						if (err) throw err;
					  
						console.log(result.student_id);
					  });
					// db.run("insert into student(student_name,student_number) values(?,?)", name,number);
				
				}
				number_flag=0;

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

