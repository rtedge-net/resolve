# *resolve* – edge-deployed DNS resolver powered by [Deno.resolveDns](https://deno.land/api?s=Deno.resolveDns)

## Deploy your own instance!

1. open https://dash.deno.com/new
2. click `ϟ Play`
3. paste https://raw.githubusercontent.com/rtedge-net/resolve/main/index.ts
4. save &amp; deploy with <kbd>Ctrl</kbd>+<kbd>S</kbd>

🥳 Congratulations! Your very own [edge-deployed](https://deno.com/deploy/docs/regions) DNS resolver is ready.<br>
Replace `resolve.deno.dev` with your own `.deno.dev`/custom hostname!

## Simple DNS Queries (`s` `&`)

### `<type>` `=` `<query>`
```URL
https://resolve.deno.dev?s&a=deno.com&cname=www.apple.com
```
```json
{
  "A": { "deno.com": [ "34.120.54.55" ] },
  "CNAME": { "www.apple.com": [ "www.apple.com.edgekey.net." ] }
}
```

### `<type1>` `,` `⋯` `=` `<query1>` `,` `⋯`

```URL
https://resolve.deno.dev?s&a,aaaa=deno.com,deno.dev&mx=deno.land
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
      { "preference": 1,  "exchange":      "aspmx.l.google.com." },
      { "preference": 5,  "exchange": "alt2.aspmx.l.google.com." },
      { "preference": 5,  "exchange": "alt1.aspmx.l.google.com." }
    ]
  }
}
```

### `x` `=` `<IP>`

```URL
https://resolve.deno.dev/?s&x=1.1.1.1,2606:4700:4700::1111&a,aaaa=one.one.one.one
```
```json
{
  "PTR": {
    "1.1.1.1.in-addr.arpa.": [ "one.one.one.one." ], "1.1.1.1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.7.4.0.0.7.4.6.0.6.2.ip6.arpa.": [ "one.one.one.one." ]
  },
  "A":    { "one.one.one.one": [ "1.0.0.1", "1.1.1.1" ] },
  "AAAA": { "one.one.one.one": [ "2606:4700:4700::1001", "2606:4700:4700::1111" ]
  }
}
```

---


## Extended Queries (<s>`s`</s> <s>`&`</s>)

Drop `s` from the query string to extend `A`, `AAAA`, `IP` results.<br>
It takes just 1 line to replace `ipinfo.io` with a different service!

### `a`

```URL
https://resolve.deno.dev/?a=deno.com
```
```JS
{ "A": { "deno.com": [ "34.120.54.55" ] } } // ← ?a=deno.com&s
{ "A": { "deno.com": { "34.120.54.55": {    // ← ?a=deno.com  (ipinfo.io) 
                         "hostname": "55.54.120.34.bc.googleusercontent.com",
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
https://resolve.deno.dev/?ip
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

### `ip` `=` `o`<br><sup>outbound/service IP<br><sup>service: Deno Deploy

```URL
https://resolve.deno.dev/?ip=o
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
