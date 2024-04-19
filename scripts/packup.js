/**
 * 备份文件路径为 packages/backup-web-src/src_YYYY-MM-DD_HH-MM-SS.zip
 */

const path = require('path');
const fs = require('fs-extra');
const compressing = require('compressing');

//格式化data时间
function timeStamp2String(time) {
  var datetime = new Date();
  datetime.setTime(time);
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
  var hour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
  var minute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
  var second = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
  return year + '-' + month + '-' + date + '_' + hour + '-' + minute + '-' + second;
}

async function backup(storagePath) {
  const backupDir = path.resolve(storagePath, '../backup-src/');
  const sourceDir = path.resolve(storagePath);
  // try {
  const t = path.resolve(backupDir, `src_${timeStamp2String(new Date().getTime())}.zip`);
  if (fs.existsSync(sourceDir) && !fs.existsSync(t)) {
    fs.ensureDirSync(backupDir);
    let files = fs.readdirSync(backupDir);
    if (files.length >= 10) {
      console.log('remove ' + files[0]);
      fs.removeSync(path.resolve(backupDir, files[0]));
    }
    console.log('backuping...');
    await compressing.zip.compressDir(sourceDir, t);
    console.log(`backup success`);
  }
  // } catch (error) {
  //   throw error;
  // }
}

backup(path.resolve(process.cwd(), 'src'));
