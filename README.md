# *resolve* – DNS queries<br><sup>edge-ready via [Deno Deploy](https://deno.com/deploy)</sup>

![example](https://user-images.githubusercontent.com/27027/216583809-65ce615c-1a9a-4d75-9e31-51bd91b05d32.png)

🆕 [**Registry Queries**](#registry-queries)
- [`WHOIS`](#whois--ipasnumberdomain)
- [`RDAP`](#rdap--ipasnumberdomain)
- [`TLD`](#tld--tld)

## Deploy your own instance!

1. open [**dash.deno.com/new**](https://dash.deno.com/new)
2. fork **Hello World**
3. paste [**raw.…/index.ts**](https://raw.githubusercontent.com/rtedge-net/resolve/main/index.ts)
4. save &amp; deploy with <kbd>**Ctrl**</kbd>+<kbd>**S**</kbd>

<!-- 2. click `ϟ Play` -->

🥳 Congratulations!

Your very own edge-deployed DNS resolver is ready.<br>
<sup>Replace `dnq.deno.dev` with your own `.deno.dev`/custom hostname!</sup>

[**Deno Deploy Regions**](https://rtedge.net/#cf=-&aws=-&db=-&flat=&u=-&zoom=1.5&dr=5) ⬅️🗺️/🌏<br><sup>live map; <kbd>T</kbd> toggle globe view</sup>
![image](https://github.com/rtedge-net/resolve/assets/27027/ad8a354b-367d-47db-9669-bd662d661e5d)


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

The [75-LoC, dependency-free implementation](https://github.com/rtedge-net/resolve/blob/main/index.ts#L4-L49) fetches data from [IANA](//iana.org) and directly queries the designated servers for
- WHOIS over port `43`
- RDAP over HTTPS

### [`whois`](https://datatracker.ietf.org/doc/html/rfc3912) `=` `<IP>`|`AS<number>`|`<domain>`

[whois.iana.org](//whois.iana.org) (port `43`)<br><sup>→ whois server → response</sup>

```URL
https://dnq.deno.dev/?whois=1.1.1.1,2606:4700:4700::1111,AS13335,cloudflare.com
```

```json
{
  "WHOIS": {
    "1.1.1.1": "% [whois.apnic.net]\n% Whois data copyright terms    http://www.apnic.net/db/dbcopyright.html\n\n% Information related to '1.1.1.0 - 1.1.1.255'\n\n% Abuse contact for '1.1.1.0 - 1.1.1.255' is 'helpdesk@apnic.net'\n\ninetnum:        1.1.1.0 - 1.1.1.255\nnetname:        APNIC-LABS\ndescr:          APNIC and Cloudflare DNS Resolver project\ndescr:          Routed globally by AS13335/Cloudflare\ndescr:          Research prefix for APNIC Labs\ncountry:        AU\norg:            ORG-ARAD1-AP\nadmin-c:        AIC3-AP\ntech-c:         AIC3-AP\nabuse-c:        AA1412-AP\nstatus:         ASSIGNED PORTABLE\nremarks:        ---------------\nremarks:        All Cloudflare abuse reporting can be done via\nremarks:        resolver-abuse@cloudflare.com\nremarks:        ---------------\nmnt-by:         APNIC-HM\nmnt-routes:     MAINT-APNICRANDNET\nmnt-irt:        IRT-APNICRANDNET-AU\nlast-modified:  2023-04-26T22:57:58Z\nmnt-lower:      MAINT-APNICRANDNET\nsource:         APNIC\n\nirt:            IRT-APNICRANDNET-AU\naddress:        PO Box 3646\naddress:        South Brisbane, QLD 4101\naddress:        Australia\ne-mail:         helpdesk@apnic.net\nabuse-mailbox:  helpdesk@apnic.net\nadmin-c:        AR302-AP\ntech-c:         AR302-AP\nauth:           # Filtered\nremarks:        helpdesk@apnic.net was validated on 2021-02-09\nmnt-by:         MAINT-AU-APNIC-GM85-AP\nlast-modified:  2021-03-09T01:10:21Z\nsource:         APNIC\n\norganisation:   ORG-ARAD1-AP\norg-name:       APNIC Research and Development\ncountry:        AU\naddress:        6 Cordelia St\nphone:          +61-7-38583100\nfax-no:         +61-7-38583199\ne-mail:         helpdesk@apnic.net\nmnt-ref:        APNIC-HM\nmnt-by:         APNIC-HM\nlast-modified:  2017-10-11T01:28:39Z\nsource:         APNIC\n\nrole:           ABUSE APNICRANDNETAU\naddress:        PO Box 3646\naddress:        South Brisbane, QLD 4101\naddress:        Australia\ncountry:        ZZ\nphone:          +000000000\ne-mail:         helpdesk@apnic.net\nadmin-c:        AR302-AP\ntech-c:         AR302-AP\nnic-hdl:        AA1412-AP\nremarks:        Generated from irt object IRT-APNICRANDNET-AU\nabuse-mailbox:  helpdesk@apnic.net\nmnt-by:         APNIC-ABUSE\nlast-modified:  2021-03-09T01:10:22Z\nsource:         APNIC\n\nrole:           APNICRANDNET Infrastructure Contact\naddress:        6 Cordelia St\n                South Brisbane\n                QLD 4101\ncountry:        AU\nphone:          +61 7 3858 3100\ne-mail:         research@apnic.net\nadmin-c:        GM85-AP\nadmin-c:        GH173-AP\nadmin-c:        JD1186-AP\ntech-c:         GM85-AP\ntech-c:         GH173-AP\ntech-c:         JD1186-AP\nnic-hdl:        AIC3-AP\nmnt-by:         MAINT-APNICRANDNET\nlast-modified:  2023-04-26T22:50:54Z\nsource:         APNIC\n\n% Information related to '1.1.1.0/24AS13335'\n\nroute:          1.1.1.0/24\norigin:         AS13335\ndescr:          APNIC Research and Development\n                6 Cordelia St\nmnt-by:         MAINT-APNICRANDNET\nlast-modified:  2023-04-26T02:42:44Z\nsource:         APNIC\n\n% This query was served by the APNIC Whois Service version 1.88.16 (WHOIS-JP3)\n\n\n",
    "2606:4700:4700::1111": "\n#\n# ARIN WHOIS data and services are subject to the Terms of Use\n# available at: https://www.arin.net/resources/registry/whois/tou/\n#\n# If you see inaccuracies in the results, please report at\n# https://www.arin.net/resources/registry/whois/inaccuracy_reporting/\n#\n# Copyright 1997-2023, American Registry for Internet Numbers, Ltd.\n#\n\n\n#\n# Query terms are ambiguous.  The query is assumed to be:\n#     \"n 2606:4700:4700::1111\"\n#\n# Use \"?\" to get help.\n#\n\nNetRange:       2606:4700:: - 2606:4700:FFFF:FFFF:FFFF:FFFF:FFFF:FFFF\nCIDR:           2606:4700::/32\nNetName:        CLOUDFLARENET\nNetHandle:      NET6-2606-4700-1\nParent:         NET6-2600 (NET6-2600-1)\nNetType:        Direct Allocation\nOriginAS:       AS13335\nOrganization:   Cloudflare, Inc. (CLOUD14)\nRegDate:        2011-11-01\nUpdated:        2017-02-17\nComment:        All Cloudflare abuse reporting can be done via https://www.cloudflare.com/abuse\nRef:            https://rdap.arin.net/registry/ip/2606:4700::\n\n\n\nOrgName:        Cloudflare, Inc.\nOrgId:          CLOUD14\nAddress:        101 Townsend Street\nCity:           San Francisco\nStateProv:      CA\nPostalCode:     94107\nCountry:        US\nRegDate:        2010-07-09\nUpdated:        2021-07-01\nRef:            https://rdap.arin.net/registry/entity/CLOUD14\n\n\nOrgAbuseHandle: ABUSE2916-ARIN\nOrgAbuseName:   Abuse\nOrgAbusePhone:  +1-650-319-8930 \nOrgAbuseEmail:  abuse@cloudflare.com\nOrgAbuseRef:    https://rdap.arin.net/registry/entity/ABUSE2916-ARIN\n\nOrgNOCHandle: CLOUD146-ARIN\nOrgNOCName:   Cloudflare-NOC\nOrgNOCPhone:  +1-650-319-8930 \nOrgNOCEmail:  noc@cloudflare.com\nOrgNOCRef:    https://rdap.arin.net/registry/entity/CLOUD146-ARIN\n\nOrgTechHandle: ADMIN2521-ARIN\nOrgTechName:   Admin\nOrgTechPhone:  +1-650-319-8930 \nOrgTechEmail:  rir@cloudflare.com\nOrgTechRef:    https://rdap.arin.net/registry/entity/ADMIN2521-ARIN\n\nOrgRoutingHandle: CLOUD146-ARIN\nOrgRoutingName:   Cloudflare-NOC\nOrgRoutingPhone:  +1-650-319-8930 \nOrgRoutingEmail:  noc@cloudflare.com\nOrgRoutingRef:    https://rdap.arin.net/registry/entity/CLOUD146-ARIN\n\nRAbuseHandle: ABUSE2916-ARIN\nRAbuseName:   Abuse\nRAbusePhone:  +1-650-319-8930 \nRAbuseEmail:  abuse@cloudflare.com\nRAbuseRef:    https://rdap.arin.net/registry/entity/ABUSE2916-ARIN\n\nRTechHandle: ADMIN2521-ARIN\nRTechName:   Admin\nRTechPhone:  +1-650-319-8930 \nRTechEmail:  rir@cloudflare.com\nRTechRef:    https://rdap.arin.net/registry/entity/ADMIN2521-ARIN\n\nRNOCHandle: NOC11962-ARIN\nRNOCName:   NOC\nRNOCPhone:  +1-650-319-8930 \nRNOCEmail:  noc@cloudflare.com\nRNOCRef:    https://rdap.arin.net/registry/entity/NOC11962-ARIN\n\n\n#\n# ARIN WHOIS data and services are subject to the Terms of Use\n# available at: https://www.arin.net/resources/registry/whois/tou/\n#\n# If you see inaccuracies in the results, please report at\n# https://www.arin.net/resources/registry/whois/inaccuracy_reporting/\n#\n# Copyright 1997-2023, American Registry for Internet Numbers, Ltd.\n#\n\n",
    "AS13335": "\n#\n# ARIN WHOIS data and services are subject to the Terms of Use\n# available at: https://www.arin.net/resources/registry/whois/tou/\n#\n# If you see inaccuracies in the results, please report at\n# https://www.arin.net/resources/registry/whois/inaccuracy_reporting/\n#\n# Copyright 1997-2023, American Registry for Internet Numbers, Ltd.\n#\n\n\n#\n# Query terms are ambiguous.  The query is assumed to be:\n#     \"a AS13335\"\n#\n# Use \"?\" to get help.\n#\n\nASNumber:       13335\nASName:         CLOUDFLARENET\nASHandle:       AS13335\nRegDate:        2010-07-14\nUpdated:        2017-02-17\nComment:        All Cloudflare abuse reporting can be done via https://www.cloudflare.com/abuse    \nRef:            https://rdap.arin.net/registry/autnum/13335\n\n\n\nOrgName:        Cloudflare, Inc.\nOrgId:          CLOUD14\nAddress:        101 Townsend Street\nCity:           San Francisco\nStateProv:      CA\nPostalCode:     94107\nCountry:        US\nRegDate:        2010-07-09\nUpdated:        2021-07-01\nRef:            https://rdap.arin.net/registry/entity/CLOUD14\n\n\nOrgTechHandle: ADMIN2521-ARIN\nOrgTechName:   Admin\nOrgTechPhone:  +1-650-319-8930 \nOrgTechEmail:  rir@cloudflare.com\nOrgTechRef:    https://rdap.arin.net/registry/entity/ADMIN2521-ARIN\n\nOrgRoutingHandle: CLOUD146-ARIN\nOrgRoutingName:   Cloudflare-NOC\nOrgRoutingPhone:  +1-650-319-8930 \nOrgRoutingEmail:  noc@cloudflare.com\nOrgRoutingRef:    https://rdap.arin.net/registry/entity/CLOUD146-ARIN\n\nOrgNOCHandle: CLOUD146-ARIN\nOrgNOCName:   Cloudflare-NOC\nOrgNOCPhone:  +1-650-319-8930 \nOrgNOCEmail:  noc@cloudflare.com\nOrgNOCRef:    https://rdap.arin.net/registry/entity/CLOUD146-ARIN\n\nOrgAbuseHandle: ABUSE2916-ARIN\nOrgAbuseName:   Abuse\nOrgAbusePhone:  +1-650-319-8930 \nOrgAbuseEmail:  abuse@cloudflare.com\nOrgAbuseRef:    https://rdap.arin.net/registry/entity/ABUSE2916-ARIN\n\nRTechHandle: ADMIN2521-ARIN\nRTechName:   Admin\nRTechPhone:  +1-650-319-8930 \nRTechEmail:  rir@cloudflare.com\nRTechRef:    https://rdap.arin.net/registry/entity/ADMIN2521-ARIN\n\nRAbuseHandle: ABUSE2916-ARIN\nRAbuseName:   Abuse\nRAbusePhone:  +1-650-319-8930 \nRAbuseEmail:  abuse@cloudflare.com\nRAbuseRef:    https://rdap.arin.net/registry/entity/ABUSE2916-ARIN\n\nRNOCHandle: NOC11962-ARIN\nRNOCName:   NOC\nRNOCPhone:  +1-650-319-8930 \nRNOCEmail:  noc@cloudflare.com\nRNOCRef:    https://rdap.arin.net/registry/entity/NOC11962-ARIN\n\n\n#\n# ARIN WHOIS data and services are subject to the Terms of Use\n# available at: https://www.arin.net/resources/registry/whois/tou/\n#\n# If you see inaccuracies in the results, please report at\n# https://www.arin.net/resources/registry/whois/inaccuracy_reporting/\n#\n# Copyright 1997-2023, American Registry for Internet Numbers, Ltd.\n#\n\n",
    "cloudflare.com": "   Domain Name: CLOUDFLARE.COM\r\n   Registry Domain ID: 1542998887_DOMAIN_COM-VRSN\r\n   Registrar WHOIS Server: whois.cloudflare.com\r\n   Registrar URL: http://www.cloudflare.com\r\n   Updated Date: 2017-05-24T17:44:01Z\r\n   Creation Date: 2009-02-17T22:07:54Z\r\n   Registry Expiry Date: 2024-02-17T22:07:54Z\r\n   Registrar: CloudFlare, Inc.\r\n   Registrar IANA ID: 1910\r\n   Registrar Abuse Contact Email:\r\n   Registrar Abuse Contact Phone:\r\n   Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited\r\n   Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited\r\n   Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited\r\n   Domain Status: serverDeleteProhibited https://icann.org/epp#serverDeleteProhibited\r\n   Domain Status: serverTransferProhibited https://icann.org/epp#serverTransferProhibited\r\n   Domain Status: serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited\r\n   Name Server: NS3.CLOUDFLARE.COM\r\n   Name Server: NS4.CLOUDFLARE.COM\r\n   Name Server: NS5.CLOUDFLARE.COM\r\n   Name Server: NS6.CLOUDFLARE.COM\r\n   Name Server: NS7.CLOUDFLARE.COM\r\n   DNSSEC: signedDelegation\r\n   DNSSEC DS Data: 2371 13 2 32996839A6D808AFE3EB4A795A0E6A7A39A76FC52FF228B22B76F6D63826F2B9\r\n   URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/\r\n>>> Last update of whois database: 2023-06-18T22:01:50Z <<<\r\n\r\nFor more information on Whois status codes, please visit https://icann.org/epp\r\n\r\nNOTICE: The expiration date displayed in this record is the date the\r\nregistrar's sponsorship of the domain name registration in the registry is\r\ncurrently set to expire. This date does not necessarily reflect the expiration\r\ndate of the domain name registrant's agreement with the sponsoring\r\nregistrar.  Users may consult the sponsoring registrar's Whois database to\r\nview the registrar's reported date of expiration for this registration.\r\n\r\nTERMS OF USE: You are not authorized to access or query our Whois\r\ndatabase through the use of electronic processes that are high-volume and\r\nautomated except as reasonably necessary to register domain names or\r\nmodify existing registrations; the Data in VeriSign Global Registry\r\nServices' (\"VeriSign\") Whois database is provided by VeriSign for\r\ninformation purposes only, and to assist persons in obtaining information\r\nabout or related to a domain name registration record. VeriSign does not\r\nguarantee its accuracy. By submitting a Whois query, you agree to abide\r\nby the following terms of use: You agree that you may use this Data only\r\nfor lawful purposes and that under no circumstances will you use this Data\r\nto: (1) allow, enable, or otherwise support the transmission of mass\r\nunsolicited, commercial advertising or solicitations via e-mail, telephone,\r\nor facsimile; or (2) enable high volume, automated, electronic processes\r\nthat apply to VeriSign (or its computer systems). The compilation,\r\nrepackaging, dissemination or other use of this Data is expressly\r\nprohibited without the prior written consent of VeriSign. You agree not to\r\nuse electronic processes that are automated and high-volume to access or\r\nquery the Whois database except as reasonably necessary to register\r\ndomain names or modify existing registrations. VeriSign reserves the right\r\nto restrict your access to the Whois database in its sole discretion to ensure\r\noperational stability.  VeriSign may restrict or terminate your access to the\r\nWhois database for failure to abide by these terms of use. VeriSign\r\nreserves the right to modify these terms at any time.\r\n\r\nThe Registry database contains ONLY .COM, .NET, .EDU domains and\r\nRegistrars.\r\n"
  }
}
```

### [`rdap`](https://www.icann.org/rdap) `=` `<IP>`|`AS<number>`|`<domain>`

[data.iana.org/rdap/dns.json](//data.iana.org/rdap.dns.json)<br><sup>→ rdap server → response</sup>

```URL
https://dnq.deno.dev/?rdap=1.1.1.1,2606:4700:4700::1111,AS13335,cloudflare.com
```

```json
{
  "RDAP": {
    "1.1.1.1": { … },
    "2606:4700:4700::1111": { … },
    "AS13335": { … },
    "cloudflare.com": {
      "entitites": [{…}, …],
      "events": [{…}, …],
      "handle": …,
      "ldhName": …,
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

### `ip`|[`whois`](https://datatracker.ietf.org/doc/html/rfc3912)|[`rdap`](https://www.icann.org/rdap)<br><sup>inbound/your IP<br><sup>same as `ip`|`whois`|`rdap` `=` `i`
### `ip`|[`whois`](https://datatracker.ietf.org/doc/html/rfc3912)|[`rdap`](https://www.icann.org/rdap) `=` `o`<br><sup>outbound/service IP<br><sup>service: [Deno Deploy](https://deno.com/deploy)


### [`tld`](https://www.iana.org/domains/root/db) `=` `<TLD>`

[data.iana.org/TLD/tlds-alpha-by-domain.txt](//data.iana.org/TLD/tlds-alpha-by-domain.txt)

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

### [`tld`](https://www.iana.org/domains/root/db)

[data.iana.org/TLD/tlds-alpha-by-domain.txt](//data.iana.org/TLD/tlds-alpha-by-domain.txt)

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
