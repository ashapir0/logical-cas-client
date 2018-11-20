<h2 align="center">Logical-CAS-Client</h2>
<p align="center">
  <a href="https://travis-ci.org/ashapir0/logical-cas-client"><img src="https://travis-ci.org/ashapir0/logical-cas-client.svg?branch=master" alt="TravisCI Build Status"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://codeclimate.com/github/ashapir0/logical-cas-client/maintainability"><img src="https://api.codeclimate.com/v1/badges/62ca6570553055446a77/maintainability" alt="Maintainability Score"/></a>
  <a href="https://codeclimate.com/github/ashapir0/logical-cas-client/test_coverage"><img src="https://api.codeclimate.com/v1/badges/62ca6570553055446a77/test_coverage" alt="Test Coverage"/></a>
  <a href="https://badge.fury.io/js/logical-cas-client"><img src="https://badge.fury.io/js/logical-cas-client.svg" alt="npm version"></a>
  <a href="https://github.com/ashapir0/logical-cas-client/pulls"><img src="https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg" alt="PR's welcome"></a>
</p>

> The Logical Central-Authentication-Service (CAS) Client, is a control-first interface for CAS services for your <a href="https://expressjs.com" target="_blank">Express</a> web-application. While authored at <a href="https://rpi.edu" target="_blank">RPI</a> the Logical-CAS-Client should be compatible with any CAS server. 

> Instead of abstracting underlying auth-strategies like other libraries, Logical-CAS-Client allows you to choose how to handle end-authentication whether with sessions, cookies, etc.

_Authored by:_
 - Aaron J. Shapiro

## Getting Started

Install Logical-CAS-Client using [`yarn`](https://yarnpkg.com/en/package/logical-cas-client):

```bash
yarn add logical-cas-client
```

Or via [`npm`](https://www.npmjs.com/):

```bash
npm install logical-cas-client
```

Let's get started by importing the library. This library is built with TypeScript, so no additional type-definitions are necessary!

```javascript
var CasClient = require("logical-cas-client");
```

```typescript
import CasClient from "logical-cas-client";
```

Prepare your configuration:
  - host: The hostname of your web-application (for development typically localhost)
  - port: The port of your web-application
  - secure: Whether or not clients should be redirected to your service with HTTPS as the protocol (again for development typically no)
  - endpoints: The url-mapping that will be used with your CAS Client
  - ticketVerificationPath: The url users will be redirected to once they've logged into CAS V2/V3 which will verify their ticket server-to-server.
  - server (port, host, secure): The above parameters but in relation to the remote CAS.

```javascript
    var config = {
      host: "localhost",
      port: 8080,
      secure: false,
      endpoints: {
        ticketVerificationPath: "/auth/ticket"
      },
      server: {
        host: "cas-auth.rpi.edu",
        secure: true,
        version: "2.0",
      }
    };
```