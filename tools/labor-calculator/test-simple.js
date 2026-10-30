const test=require('node:test'),assert=require('node:assert');const {leavePay}=require('./core.js');
test('README 示例 6525 元 3 天',()=>{const r=leavePay(6525,3);assert.equal(r.daily,300);assert.equal(r.extra,1800);assert.equal(r.total,2700);assert.equal(r.normal,900)});
test('半天',()=>{assert.equal(leavePay(4350,0.5).extra,200)});
test('非法输入',()=>{assert.throws(()=>leavePay(0,3));assert.throws(()=>leavePay(5000,0))});
