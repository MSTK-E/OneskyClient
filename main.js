'use strict';

// アプリケーション作成用モジュールをロード
var app = require('app');
var BrowserWindow = require('browser-window');

// クラッシュレポート
require('crash-reporter').start();

var mainWindow = null;

// 全てのウィンドウが閉じたらアプリケーションを終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// アプリケーションの初期化が完了したら呼び出
app.on('ready', function() {

  // Chromium の起動, 初期画面ロード
  mainWindow = new BrowserWindow({
    width: 500,
    height: 1000
  });

  // メインウィンドウに表示するURLを指定
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
