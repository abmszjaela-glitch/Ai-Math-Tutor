import test from 'node:test';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('../src/component/Practice/practiceApi.js', import.meta.url), 'utf8')).replace(/^import .*API_URL.*;$/m, "const API_URL = '/api';");
const { practiceRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('successful requests carry credentials, JSON body and cancellation signal', async (t) => {
  t.mock.method(globalThis,'fetch',async (url, options) => { assert.equal(url,'/api/practice/submit'); assert.equal(options.credentials,'include'); assert.equal(options.headers['Content-Type'],'application/json'); assert.ok(options.signal); return {ok:true,json:async()=>({success:true,result:{score:100}})}; });
  assert.equal((await practiceRequest('/submit',{method:'POST',body:'{}'})).result.score,100);
});
test('HTTP failures preserve status and distinguish expired attempt from expired login', async (t) => {
  t.mock.method(globalThis,'fetch',async()=>({ok:false,status:401,json:async()=>({success:false,code:'ATTEMPT_EXPIRED',message:'Expired'})}));
  await assert.rejects(practiceRequest('/submit'),error=>error.status===401&&error.code==='ATTEMPT_EXPIRED');
});
test('malformed and null JSON do not become successful responses', async (t) => {
  const fetch=t.mock.method(globalThis,'fetch',async()=>({ok:true,json:async()=>{throw new Error('not JSON');}}));
  await assert.rejects(practiceRequest('/attempts'),/unreadable response/);
  fetch.mock.mockImplementation(async()=>({ok:true,json:async()=>null}));
  await assert.rejects(practiceRequest('/attempts'),/Unable to complete/);
});
test('a stalled request times out and can be retried', async (t) => {
  t.mock.timers.enable({apis:['setTimeout']});
  const fetch=t.mock.method(globalThis,'fetch',async (url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true})));
  const pending=practiceRequest('/submit'); const check=assert.rejects(pending,/timed out/);
  t.mock.timers.tick(20000); await check;
  fetch.mock.mockImplementation(async()=>({ok:true,json:async()=>({success:true})}));
  assert.equal((await practiceRequest('/submit')).success,true);
});
test('unmount cancellation remains an AbortError instead of a timeout', async (t) => {
  t.mock.method(globalThis,'fetch',async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true})));
  const controller=new AbortController(),pending=practiceRequest('/attempts',{signal:controller.signal});
  const check=assert.rejects(pending,error=>error.name==='AbortError');controller.abort();await check;
});
