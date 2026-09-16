import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, normalizePhone, duplicateReasons, type Candidate } from '../src/lib/data-quality';
test('tracking URL removed without losing meaningful query',()=>{
 assert.equal(normalizeUrl('https://example.org/event?id=3&utm_source=test#top'),'https://example.org/event?id=3');
 assert.equal(normalizeUrl('javascript:alert(1)'),null);
});
test('French phones normalize; invalid values stay invalid',()=>{
 assert.equal(normalizePhone('06 12 34 56 78'),'+33612345678');
 assert.equal(normalizePhone('0033 6 12 34 56 78'),'+33612345678');
 assert.equal(normalizePhone('123'),null);
});
const base:Candidate={id:'a',category:'event',title:'Conférence sur la solidarité locale',city:'Paris',dateStart:new Date('2026-10-01'),sourceUrl:'https://example.org/event',metadata:{raw:{email:'hello@example.org'}}};
test('recurring events on different dates are not merged',()=>{
 assert.deepEqual(duplicateReasons(base,{...base,id:'b',dateStart:new Date('2026-10-02')}),[]);
});
test('same date and identity yields review evidence',()=>{
 assert.deepEqual(duplicateReasons(base,{...base,id:'b'}),['url','email','title']);
});
test('different category never matches on shared contact',()=>{
 assert.deepEqual(duplicateReasons(base,{...base,category:'institute'}),[]);
});
