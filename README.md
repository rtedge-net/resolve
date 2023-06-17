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

## Registry Queries

The self-contained implementation uses the latest [IANA](https://www.iana.org/) data and has zero dependencies.

[1]: https://whois.iana.org
[2]: https://data.iana.org/rdap/dns.json

### [`whois`](https://datatracker.ietf.org/doc/html/rfc3912) `=` `<domain>`<br><sup>whois.iana.org<br><sup>→ whois server → response</sup></sup>

```URL
https://dnq.deno.dev?whois=deno.dev
```

```json
{
  "WHOIS": {
    "deno.dev": "Domain Name: deno.dev\r\nRegistry Domain ID: 332D63186-DEV\r\nRegistrar WHOIS Server: whois.namecheap.com\r\nRegistrar URL: https://www.namecheap.com/\r\nUpdated Date: 2020-12-19T14:25:36Z\r\nCreation Date: 2019-02-28T16:00:05Z\r\nRegistry Expiry Date: 2024-02-28T16:00:05Z\r\nRegistrar: Namecheap Inc.\r\nRegistrar IANA ID: 1068\r\nRegistrar Abuse Contact Email: abuse@namecheap.com\r\nRegistrar Abuse Contact Phone: +1.6613102107\r\nDomain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited\r\nRegistry Registrant ID: REDACTED FOR PRIVACY\r\nRegistrant Name: REDACTED FOR PRIVACY\r\nRegistrant Organization: Privacy service provided by Withheld for Privacy ehf\r\nRegistrant Street: REDACTED FOR PRIVACY\r\nRegistrant Street:\r\nRegistrant City: REDACTED FOR PRIVACY\r\nRegistrant State/Province: Capital Region\r\nRegistrant Postal Code: REDACTED FOR PRIVACY\r\nRegistrant Country: IS\r\nRegistrant Phone: REDACTED FOR PRIVACY\r\nRegistrant Email: Please query the WHOIS server of the owning registrar identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name. \r\nRegistry Admin ID: REDACTED FOR PRIVACY\r\nAdmin Name: REDACTED FOR PRIVACY\r\nAdmin Organization: REDACTED FOR PRIVACY\r\nAdmin Street: REDACTED FOR PRIVACY\r\nAdmin Street:\r\nAdmin City: REDACTED FOR PRIVACY\r\nAdmin State/Province: REDACTED FOR PRIVACY\r\nAdmin Postal Code: REDACTED FOR PRIVACY\r\nAdmin Country: REDACTED FOR PRIVACY\r\nAdmin Phone: REDACTED FOR PRIVACY\r\nAdmin Email: Please query the WHOIS server of the owning registrar identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name. \r\nRegistry Tech ID: REDACTED FOR PRIVACY\r\nTech Name: REDACTED FOR PRIVACY\r\nTech Organization: REDACTED FOR PRIVACY\r\nTech Street: REDACTED FOR PRIVACY\r\nTech Street:\r\nTech City: REDACTED FOR PRIVACY\r\nTech State/Province: REDACTED FOR PRIVACY\r\nTech Postal Code: REDACTED FOR PRIVACY\r\nTech Country: REDACTED FOR PRIVACY\r\nTech Phone: REDACTED FOR PRIVACY\r\nTech Email: Please query the WHOIS server of the owning registrar identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name. \r\nRegistry Billing ID: REDACTED FOR PRIVACY\r\nBilling Name: REDACTED FOR PRIVACY\r\nBilling Organization: REDACTED FOR PRIVACY\r\nBilling Street: REDACTED FOR PRIVACY\r\nBilling Street:\r\nBilling City: REDACTED FOR PRIVACY\r\nBilling State/Province: REDACTED FOR PRIVACY\r\nBilling Postal Code: REDACTED FOR PRIVACY\r\nBilling Country: REDACTED FOR PRIVACY\r\nBilling Phone: REDACTED FOR PRIVACY\r\nBilling Email: Please query the WHOIS server of the owning registrar identified in this output for information on how to contact the Registrant, Admin, or Tech contact of the queried domain name. \r\nName Server: ns-cloud-c1.googledomains.com\r\nName Server: ns-cloud-c2.googledomains.com\r\nName Server: ns-cloud-c3.googledomains.com\r\nName Server: ns-cloud-c4.googledomains.com\r\nDNSSEC: unsigned\r\nURL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/\r\n>>> Last update of WHOIS database: 2023-06-16T21:11:56Z <<<\r\n\r\nFor more information on Whois status codes, please visit https://icann.org/epp\r\n\r\nPlease query the WHOIS server of the owning registrar identified in this\r\noutput for information on how to contact the Registrant, Admin, or Tech\r\ncontact of the queried domain name.\r\n\r\nWHOIS information is provided by Charleston Road Registry Inc. (CRR) solely\r\nfor query-based, informational purposes. By querying our WHOIS database, you\r\nare agreeing to comply with these terms\r\n(https://www.registry.google/about/whois-disclaimer.html) and acknowledge\r\nthat your information will be used in accordance with CRR's Privacy Policy\r\n(https://www.registry.google/about/privacy.html), so please read those\r\ndocuments carefully.  Any information provided is \"as is\" without any\r\nguarantee of accuracy. You may not use such information to (a) allow,\r\nenable, or otherwise support the transmission of mass unsolicited,\r\ncommercial advertising or solicitations; (b) enable high volume, automated,\r\nelectronic processes that access the systems of CRR or any ICANN-Accredited\r\nRegistrar, except as reasonably necessary to register domain names or modify\r\nexisting registrations; or (c) engage in or support unlawful behavior. CRR\r\nreserves the right to restrict or deny your access to the Whois database,\r\nand may modify these terms at any time.\r\n"
  }
}
```

### [`rdap`](https://www.icann.org/rdap) `=` `<domain>`<br><sup>data.iana.org/rdap/dns.json<br><sup>→ rdap server → response</sup></sup>

```URL
https://dnq.deno.dev/?rdap=deno.dev
```

```json
{
  "RDAP": {
    "deno.dev": {
      "entitites": [{…}, …],
      "events": [{…}, …],
      "handle": "332D63186-DEV",
      "ldhName": "deno.dev",
      "links": [{…}, …],
      "nameservers": [{…}, …],
      "notices": [{…}, …],
      "objectClassName": "domain",
      "rdapConformance": ["rdap_level_0", …],
      "secureDNS": {"delegationSigned": false, …},
      "status": ["client transfer prohibited"],
    }
  }
}
```

### [`rdap`](https://www.icann.org/rdap)<br><sup>data.iana.org/rdap/dns.json<br><sup>transformed for convenience</sup>

```URL
https://dnq.deno.dev/?rdap
```

```json
{
  "RDAP": {
    "": {
      "description": …,
      "publication": …,
      "services": {
        …,
        "samsung": ["https://nic.samsung:8443/rdap/"],
        "xn--cg4bki": ["https://nic.samsung:8443/rdap/"],
        …
      },
      "servers": {
        "https://nic.samsung:8443/rdap/": [ "samsung", "xn--cg4bki" ]
      }
    }
  }
}
```

### `tld` `=` `<TLD>`<br><sup>data.iana.org/TLD/tlds-alpha-by-domain.txt</sup>

```URL
https://dnq.deno.dev/?tld=kr,jp,zz
```
Future versions may expand `true`.


```json
{
  "TLD": {
    "kr": true,
    "jp": true,
    "zz": false
  }
}
```

### `tld`<br><sup>data.iana.org/TLD/tlds-alpha-by-domain.txt</sup>

```URL
https://dnq.deno.dev/?tld
```

```json
{
  "TLD": {
    "": [
      "aaa",
      "aarp",
      …
    ]
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
