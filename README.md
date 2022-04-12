# FireFly Sandbox

[![stability-alpha](https://img.shields.io/badge/stability-alpha-f4d03f.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#alpha)
[![FireFy Documentation](https://img.shields.io/static/v1?label=FireFly&message=documentation&color=informational)](https://hyperledger.github.io/firefly//)

![Hyperledger FireFly](./images/hyperledger_firefly_logo.png)

This is an API exerciser and prototyping tool for applications that communicate with FireFly.

### Dashboard

![Sandbox Dashboard](./ui/src/images/dashboard.png)

## Setup

To run the application, you will require a 2-party FireFly system running
locally on ports 5000 & 5001. The easiest way to set this up is with the
[FireFly CLI](https://github.com/hyperledger/firefly-cli):

```
ff init sandbox 2
ff start sandbox
```

## Running

Once the FireFly stack is ready, set up and run the sample with:

```
cd server
npm install
npm run start:dev
```

```
cd ui
npm install
npm start
```

Your application should now be ready to use at [localhost:3000](localhost:3000).

## Learn more about Hyperledger FireFly Architecture

- [YouTube Channel](https://www.youtube.com/playlist?list=PL0MZ85B_96CFVEdBNsHRoX_f15AJacZJD)
  - Check out the architecture series
- [Architecture reference documentation](https://hyperledger.github.io/firefly/architecture/node_component_architecture.html)
  - Still evolving, and open for feedback - let us know what you think [on Rocket Chat](https://chat.hyperledger.org/channel/firefly)

## Git repositories

There are multiple Git repos making up the Hyperledger FireFly project, and this
list is likely to grow as additional pluggable extensions come online in the community:

- Command Line Interface (CLI) - https://github.com/hyperledger/firefly-cli
- Core - https://github.com/hyperledger/firefly
- FireFly SDK - https://github.com/kaleido-io/firefly-sdk-nodejs
- FireFly Sandbox (this repo) - https://github.com/kaleido-io/firefly-sandbox
- HTTPS Data Exchange - https://github.com/hyperledger/firefly-dataexchange-https
- Hyperledger Fabric connector - https://github.com/hyperledger/firefly-fabconnect
- Ethereum (Hyperledger Besu / Quorum) connector - https://github.com/hyperledger/firefly-ethconnect
- Corda connector: https://github.com/hyperledger/firefly-cordaconnect - contributed from Kaleido generation 1 - porting to generation 2
- FireFly Explorer UI - https://github.com/hyperledger/firefly-ui
- Firefly Performance CLI (https://github.com/hyperledger/firefly-perf-cli)

## Contributing

Interested in contributing to the community?

Check out our [Contributor Guide](https://hyperledger.github.io/firefly/contributors/contributors.html), and welcome!

Please adhere to this project's [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the [LICENSE](LICENSE) file.
