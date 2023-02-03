import { serve, ConnInfo } from "https://deno.land/std/http/server.ts";
import { Status }          from "https://deno.land/std/http/http_status.ts";
import   ip6               from "https://deno.land/x/ip6/ip6.js";

const         CT = `content-type`;
const TP = { [CT]: `text/plain;charset=utf-8` };
const TH = { [CT]: `text/html;charset=utf-8` };
const TJ = { [CT]: `text/javascript;charset=utf-8` };
const AJ = { [CT]: `application/json;charset=utf-8` };
const         ACXH = `access-control-expose-headers`;
const         ACAO = `access-control-allow-origin`;
const XH = { [ACXH]: '_, ip, ip-x, dur, server, server-timing' };
const AO = { [ACAO]: '*' };
const NS = { 'cache-control': 'no-store' };
const HSTS = { "strict-transport-security": "max-age=31536000; includeSubDomains; preload" };

const JP = (...v) => { try { return JSON.parse    (...v); } catch (e) { } };
const JS =                          JSON.stringify;

const PF = 'fulfilled';
const PR =  'rejected';


const resolve = async (t, q, ...O) => {
  try       { return await (t === 'AS' ? ip.info(`AS${q.replace(/^ASN?/i, '')}`) : t === 'IP' ? q : Deno.resolveDns(q, t, ...O)); } 
  catch (e) { return { error: e.message } }
};
const rextend = async (t, q, ...O) => {
  const o = await resolve(t, q, ...O);
  return ip.type.has(t) && o.map ? (await Promise.all(o.map(ip.info))).reduce((x, { ip, ...O }) => (x[ip] = O, x), {}) : t === 'IP' ? ip.info(o) : o;
};

const ip = { v4: q => !q.includes(':'),
  type: new Set([ 'A', 'AAAA', 'IP' ]),
  info:    q => undefined,
  reverse: q => ip.v4(q) ? q.split('.').reverse().join('.') : ip6.ptr(q, 0),
  ptr:     q => `${ip.reverse(q)}.${ip.v4(q) ? 'in-addr' : 'ip6'}.arpa.`
};
ip.info.user = q => fetch(`https://ipinfo.io/${q}?${new URLSearchParams({ token: Deno.env.get('IPINFO_TOKEN') })}`).then(f => f.json())                                .catch(e => ({ ip: q, error: e.message }));
ip.info.curl = q => fetch(`https://ipinfo.io/${q}`,                   { headers: { "user-agent": "curl/7.81.0" } }).then(f => f.json()).then(o => (delete o.readme, o)).catch(e => ({ ip: q, error: e.message }));
ip.info.user.user = ip.info.user; ip.info.curl.user = ip.info.user;
ip.info.user.curl = ip.info.curl; ip.info.curl.curl = ip.info.curl;

const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
Object.prototype.sort = function({ K = true, V = false } = {}) { const C = 0; if (C) console.warn('Object.sort()', 0, { K, V }, this);
  if (!K && !V) return structuredClone(this);
  if (       V) throw new Error(`Object.sort(${JSON.stringify({ K, V })}) not implemented`); const i = structuredClone(this);
  for (const k of Object.keys(i).sort()) { delete this[k]; this[k] = i[k]; }; if (C) console.warn('Object.sort()', 1, { K, V }, this); return this;
};
const sort = x => { try { x?.sort?.(); } catch (e) {} return x; }; // MX records cannot be sorted [{},{}]

const                                     A = new Set([ /* allowed source IPs */ ]);
serve(async (r: Request, c: ConnInfo) => { console.warn('----------------------------------------------'); console.warn(r.url, c); const ta = performance.now();
//const a = c?.remoteAddr?.hostname; if (!A.has(a)) return new Response('403 Forbidden', { status: Status.Forbidden, headers: { ...TP, ...NS, ...AO, ...HSTS } });
  ip.info = ip.info[Deno.env.get('IPINFO_TOKEN') ? 'user' : 'curl'];
  const u = new URL(r.url);
  const p = u.pathname;
  switch (p) { case '/ipinfo.io': return fetch(`https://ipinfo.io/1.1.1.1?${new URLSearchParams({ token: Deno.env.get('IPINFO_TOKEN') })}`); }
  const I = c.remoteAddr.hostname;
  const O = c. localAddr.hostname;
  const C = { IP: JS({ i: I, o: O }), "IP-X": "https://ipinfo.io", ...XH };
  const q = u.searchParams; //   _               _____________________
  const _ = JP(q.get('_')); // { _ = nameServer: { ipAddr, port = 53 } } https://deno.land/api@latest?s=Deno.ResolveDnsOptions
  const s =    q.get('s') !== null;
  const i =    q.get('i') ===   ''; [ '_', 's', 'i' ].forEach(x => q.delete(x));
  const f = s ? resolve : rextend;
  const X = { "": I, I, O };
  const m = q =>      X[q.toUpperCase()] ?? q;
  const Q = [...q.entries()].flatMap(([ T, Q ]) => cartesian(T.split(','), Q.split(',')).map(([ t, q ]) => [ t.toUpperCase(), m(q) ])).map(([ t, q ]) => [ t === 'X' ? 'PTR' : t, t === 'X' ? ip.ptr(q) : q ]); console.warn(Q, { i, _ });
  if   (Q.length === 0) return Response.redirect('https://apple.com', 308); // obfuscation
  if   (i)      return new Response(JS(Q, '', '  '), { headers: { _: JS(_), ...C, ...AJ, ...NS, ...AO, ...HSTS } });
  try {
    const                                  R = await Promise.all(Q.map(async ([ t, q ]) => [ t, [ q, await f(t, q, _ ?? {}).then(sort) ] ]));
    const                              O = R.reduce((x, [ t, [ q, r ]]) => (x[t] !== undefined ? (x[t][q] = r) : (x[t] = { [q]: r }), x), {}); C.dur = performance.now() - ta; C['server-timing'] = `total;dur=${C.dur}`;
    return             new Response(JS(O, '', '  '), { headers: { _: JS(_), ...C, ...AJ, ...NS, ...AO, ...HSTS } });
  } catch (e) { return new Response(   e.stack,      { headers: { _: JS(_), ...C, ...TP, ...NS, ...AO, ...HSTS } }); }
});
