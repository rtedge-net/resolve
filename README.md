# *resolve* – edge-deployed DNS query API<br><sup>powered by [Deno.resolveDns](https://deno.land/api?s=Deno.resolveDns)

![example](https://user-images.githubusercontent.com/27027/216583809-65ce615c-1a9a-4d75-9e31-51bd91b05d32.png)

## Deploy your own instance!

1. open [dash.deno.com/new](https://dash.deno.com/new)
2. click `ϟ Play`
3. paste [raw.…/index.ts](https://raw.githubusercontent.com/rtedge-net/resolve/main/index.ts)
4. save &amp; deploy with <kbd>Ctrl</kbd>+<kbd>S</kbd>

🥳 Congratulations! Your very own [edge-deployed](https://deno.com/deploy/docs/regions) DNS resolver is ready.<br>
Replace `dnq.deno.dev` with your own `.deno.dev`/custom hostname!

## Simple Queries (`s` `&`)

### `<type>` `=` `<query>`
```URL
https://dnq.deno.dev?s&a=deno.com&cname=www.apple.com
```
```json
{
  "A": { "deno.com": [ "34.120.54.55" ] },
  "CNAME": { "www.apple.com": [ "www.apple.com.edgekey.net." ] }
}
```

### `<type1>` `,` `…` `=` `<query1>` `,` `…`

```URL
https://dnq.deno.dev?s&a,aaaa=deno.com,deno.dev&mx=deno.land
```
```json
{
  "A": {
    "deno.com": [ "34.120.54.55" ],
    "deno.dev": [ "34.120.54.55" ]
  },
  "AAAA": {
    "deno.com": [ "2600:1901:0:6d85::" ],
    "deno.dev": [ "2600:1901:0:6d85::" ]
  },
  "MX": {
    "deno.land": [
      { "preference": 10, "exchange": "alt3.aspmx.l.google.com." },
      { "preference": 10, "exchange": "alt4.aspmx.l.google.com." },
      { "preference":  1, "exchange":      "aspmx.l.google.com." },
      { "preference":  5, "exchange": "alt2.aspmx.l.google.com." },
      { "preference":  5, "exchange": "alt1.aspmx.l.google.com." }
    ]
  }
}
```

### `x` `=` `<IP>`<br><sup>[Reverse DNS](https://en.wikipedia.org/wiki/Reverse_DNS_lookup)

```URL
https://dnq.deno.dev/?s&x=1.1.1.1,2606:4700:4700::1111&a,aaaa=one.one.one.one
```
```json
{
  "PTR": {
    "1.1.1.1.in-addr.arpa.": [ "one.one.one.one." ],
    "1.1.1.1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.7.4.0.0.7.4.6.0.6.2.ip6.arpa.": [ "one.one.one.one." ]
  },
  "A":    { "one.one.one.one": [ "1.0.0.1", "1.1.1.1" ] },
  "AAAA": { "one.one.one.one": [ "2606:4700:4700::1001", "2606:4700:4700::1111" ]
  }
}
```



---

## Specify Options ([`_`](https://deno.land/api?s=Deno.ResolveDnsOptions))<br><sup><sup>`_` `:` [`Deno.ResolveDnsOptions`](https://deno.land/api?s=Deno.ResolveDnsOptions)

```URL
https://dnq.deno.dev/?s&a=deno.com&_={"nameServer":{"ipAddr":"1.1.1.1"}}
```
```
{ "A": { "deno.com": [ "34.120.54.55" ] } }
```



---

## Extended Queries (<s>`s`</s> <s>`&`</s>)

Remove **`s`** to extend `A`, `AAAA`, `IP` results.<br>
It takes [1 line to use/replace `ipinfo.io`](https://github.com/rtedge-net/resolve/blob/b9a8f1b0f761b1fffb3df12fdbf0808303f92d19/index.ts#L39)!

### `a`

```URL
https://dnq.deno.dev/?a=deno.com
```
```JS
s
← { "A": { "deno.com": [ "34.120.54.55" ] } } // ← ?a=deno.com&s
→ { "A": { "deno.com": { "34.120.54.55": {    // ← ?a=deno.com    (ipinfo.io) 
-                          "hostname": "55.54.120.34.bc.googleusercontent.com",
                           "anycast": true,
                           "city": "Kansas City",
                           "region": "Missouri",
                           "country": "US",
                           "loc": "39.0997,-94.5786",
                           "org": "AS396982 Google LLC",
                           "postal": "64106",
                           "timezone": "America/Chicago" } } } }
```

### `ip`<br><sup>inbound/your IP<br><sup>same as `ip` `=` `i`

```URL
https://dnq.deno.dev/?ip
```
```JS
{
  "IP": {           // ↓ ipinfo.io
    "###.###.###.###": {
      "city": "Suwon",
      "country": "KR",
      "ip": "###.###.###.###",
      "loc": "37.3212,127.0944",
      "org": "AS4766 Korea Telecom",
      "postal": "16841",
      "region": "Gyeonggi-do",
      "timezone": "Asia/Seoul"
    }
  }
}
```

### `ip` `=` `o`<br><sup>outbound/service IP<br><sup>service: [Deno Deploy](https://deno.com/deploy)

```URL
https://dnq.deno.dev/?ip=o
```
```JS
{
  "IP": {        // ↓ ipinfo.io
    "34.120.54.55": {
      "anycast": true,
      "city": "Kansas City",
      "country": "US",
      "hostname": "55.54.120.34.bc.googleusercontent.com",
      "ip": "34.120.54.55",
      "loc": "39.0997,-94.5786",
      "org": "AS396982 Google LLC",
      "postal": "64106",
      "region": "Missouri",
      "timezone": "America/Chicago"
    }
  }
}
```



---

## Contained Errors

Errors from one query does not affect others.

```URL
https://dnq.deno.dev/?ns=x,.&ip=x,1.1.1.1&a=x,apple.com
```
```JS
{
  "NS": {
    "x": { "error": "no record found for Query { name: Name(\"x.\"), query_type: NS, query_class: IN }" },
    ".": [ "a.root-servers.net.", …, "m.root-servers.net." ]
  },
  "IP": {
    "x": { "error": { "title": "Wrong ip", "message": "Please provide a valid IP address" }, "status": 404 },
    "1.1.1.1": { "anycast": true, …, "timezone": "America/Los_Angeles" }
  },
  "A": {
    "x": { "error": "no record found for Query { name: Name(\"x.\"), query_type: A, query_class: IN }" },
    "apple.com": { "17.253.144.10": { "anycast": true, …, "org": "AS714 Apple Inc.", … } }
  }
}
```



---

## [Exposed Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)

[`_`](#specify-options-__--denoresolvednsoptions), [`ip`](#ipinboundyour-ipsame-as-ip--i), `ip-x`, `dur`, [`server`](https://deno.com/deploy/docs/regions), [`server-timing`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing)<br>
are exposed for out-of-band consumption.

```HTTP
_: {"nameServer":{"ipAddr":"1.1.1.1"}}
ip: {"i":"###.###.###.###","o":"34.120.54.55"}
ip-x: https://ipinfo.io
dur: 6
server: deno/gcp-asia-northeast3
server-timing: total;dur=6
```

```JS
await fetch(`https://dnq.deno.dev/?s&a=deno.com&_={"nameServer":{"ipAddr":"1.1.1.1"}}`)
  .then(async response => [ response.headers.get('dur'), await response.json() ]);
/* result → */            [                         4  ,               {A:{…}} ]
```


---
---
---

## [Deno Deploy](https://deno.com/deploy)

### [Seoul](https://en.wikipedia.org/wiki/Seoul), [South Korea](https://en.wikipedia.org/wiki/South_Korea) tests<br><sup>[`deno/gcp-asia-northeast3`](https://deno.com/deploy/docs/regions)

```JS
await fetch(`https://dnq.deno.dev/?s&a=deno.com&_={"nameServer":{"ipAddr":"1.1.1.1"}}`)
  .then(async f => [ f.headers.get('server'), f.headers.get('dur'), await f.json() ])
```

| `_`                                                  | `dur`  | `A` | DNS service |
| :-                                                   |    -:  |  -  | :- |
| `_={"nameServer":{"ipAddr":"1.1.1.1"}}`              |  `4ms` | ✔️ | [Cloudflare](https://1.1.1.1/dns/)
| `_={"nameServer":{"ipAddr":"8.8.8.8"}}`              | `40ms` | ✔️ | [Google Public](https://developers.google.com/speed/public-dns/docs/using#addresses)
| `_={"nameServer":{"ipAddr":"2606:4700:4700::1111"}}` |  `0ms` | ❌ | [Cloudflare](https://1.1.1.1/dns/)
| `_={"nameServer":{"ipAddr":"2001:4860:4860::8888"}}` |  `0ms` | ❌ | [Google Public](https://developers.google.com/speed/public-dns/docs/using#addresses)

✔️: `{ A: { "deno.com": [ "34.120.54.55" ]                                                                  } }`<br>
❌: `{ A: { "deno.com": { "error": "proto error: io error: Cannot assign requested address (os error 99)" } } }`  

### `IPv6` support

| Target                                 | `IPv4` | `IPv6`
| :-                                     | :-: | :-:
| Deno (Local)                           | ✔️ | ✔️
| [Deno Deploy](https://deno.com/deploy) | ✔️ | ❌
