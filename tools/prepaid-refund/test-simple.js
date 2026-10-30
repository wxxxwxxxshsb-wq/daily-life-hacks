const test=require('node:test'),assert=require('node:assert');const {refund}=require('./core.js');
test('潢川县法院案例：充 2000 送 1000，消费 434，余额 2566 → 1710.67（法院 1711）',()=>{const r=refund(2566,2000,1000);assert.equal(r.refund,1710.67);assert.equal(r.used,434)});
test('与完整版公式一致：实付 − 已扣×比例',()=>{for(const [p,g,u] of [[1000,500,300],[3000,0,1200],[500,100,0]]){const b=p+g-u;assert.ok(Math.abs(refund(b,p,g).refund-(p-u*p/(p+g)))<0.006)}});
test('无赠送 = 余额',()=>{assert.equal(refund(800,1000,0).refund,800)});
test('余额超过实付+赠送报错',()=>{assert.throws(()=>refund(4000,2000,1000))});
