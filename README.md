<h1 align="center">Swap UI</h1>
<br />
<p align="center">
<img width="250" src="https://ftx.com/static/media/fida.ce20eedf.svg"/>
</p>
<p align="center">
<a href="https://twitter.com/bonfida">
<img src="https://img.shields.io/twitter/url?label=Bonfida&style=social&url=https%3A%2F%2Ftwitter.com%2Fbonfida">
</a>
</p>

<br />

<div align="center">
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
</div>

<br />

```
git clone https://github.com/Bonfida/swap-ui
cd swap-ui
yarn
yarn dev
```

This swap UI is using [Jupiter](https://docs.jup.ag/how-does-jupiter-work) under the hood

<img src="assets/ui.png" />

<br />
<h2 align="center">Environment variables</h2>
<br />

[Environment variables](https://vitejs.dev/guide/env-and-mode.html) should be defined in `.env.local` and `.env.production`.

```
VITE_RPC= Your RPC URL
VITE_FEES= The address used to collect fees
VITE_FEES_BPS= The fees you want to charge on transaction
VITE_GEN_GO_TOKEN= The URL to fetch the auth token (might not be applicable)
GENERATE_SOURCEMAP=false
```
