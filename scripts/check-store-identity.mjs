import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const store=fs.readFileSync(path.join(root,'assets/store.js'),'utf8');
const crew=fs.readFileSync(path.join(root,'assets/crew.js'),'utf8');
const now=Date.now();

function session(trip,remote,local={},me='',pending={}){
  const data=new Map([
    ['wtc-me',me],
    ['wtc-crew-'+trip,JSON.stringify(local)],
    ['wtc-pending-'+trip,JSON.stringify(pending)]
  ]);
  const posts=[];
  const window={WTC_CFG:{trip,apiUrl:'https://example.test/store'},addEventListener(){},dispatchEvent(){}};
  const localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
  const fetch=async (_url,options)=>{
    if(options?.method==='POST'){
      const body=JSON.parse(options.body); posts.push(body); remote[body.key]=body.entry;
      return {ok:true,status:200};
    }
    return {ok:true,status:200,json:async()=>({trip,crew:structuredClone(remote)})};
  };
  const context=vm.createContext({window,localStorage,fetch,CustomEvent:class{},Date,Promise});
  vm.runInContext(store,context); vm.runInContext(crew,context);
  return {window,posts,remote,data};
}

const remote={'mantas utas':{name:'Mantas Šutas',going:'in',signup:{dates:['Oct 10']},plan:{sel:{anchor:'80cm',mainStop:'none'}},updated:now-10000}};
const local={
  'mantas utas':structuredClone(remote['mantas utas']),
  'mantas šutas':{name:'Mantas Šutas',going:'in',plan:{sel:{anchor:'80cm',mainStop:'mindunai'}},updated:now-1000},
  'mantas sutas':{name:'Mantas Sutas',going:'in',updated:now-2000}
};
const s=session('observatory',remote,local,'Mantas Sutas');
await s.window.Store.all();
assert.equal(s.window.CREW.all().length,1,'accent and old cache keys show one person');
assert.equal(s.window.CREW.all()[0].name,'Mantas Šutas (you)');
assert.equal(s.window.Store.key('Mantas Sutas'),'mantas utas','edits target the existing Worker record');
assert.equal(s.window.Store.cached()['mantas utas'].plan.sel.mainStop,'mindunai','newer local plan survives migration');
assert.equal(s.window.Store.cached()['mantas utas'].signup.dates[0],'Oct 10','older sign-up survives migration');
assert.equal(Object.keys(s.window.Store.cached()).length,1);
await s.window.Store.saveMine({plan:{sel:{anchor:'80cm',mainStop:'dubingiai'}}});
assert.equal(s.posts.at(-1).key,'mantas utas','save uses existing Worker key');
assert.equal(Object.keys(remote).length,1,'save does not create another person');
assert.equal(remote['mantas utas'].name,'Mantas Šutas','saved record keeps the existing display spelling');

const queuedRemote={'mantas utas':{name:'Mantas Šutas',updated:now-10000}};
const queued=session('observatory',queuedRemote,{},'Mantas Šutas',{
  'mantas šutas':{name:'Mantas Šutas',plan:{sel:{anchor:'80cm'}},updated:now-1000}
});
await queued.window.Store.all();
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(queued.posts[0].key,'mantas utas','queued offline write uses the shared key');
assert.equal(Object.keys(queuedRemote).length,1);

const stale=session('observatory',{}, {'old ghost':{name:'Old Ghost',updated:now-600000}});
await stale.window.Store.all();
assert.equal(stale.window.CREW.all().length,0,'deleted remote entries do not reappear from stale cache');

const future=session('future-trip',{}, {'future person':{name:'Future Person',updated:now-1000}});
await future.window.Store.all();
assert.equal(future.window.CREW.all().length,1,'another trip keeps its own cache');
assert.equal(future.window.Store.trip,'future-trip');

console.log('Store identity, preserved plan/sign-up, stale cache and future-trip isolation passed.');
