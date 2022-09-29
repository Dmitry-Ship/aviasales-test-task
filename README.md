# aviasales-test-task

## ⚡️ Quick Start

1. Run `npm install`
2. Run `npm run dev`
3. Go to http://localhost:3000

## ⛳️ Feature flags service

```ts
const featureFlagsService = new FeatureFlagsService();

featureFlagsService.onFetched((flags) => console.log("fetched flags: ", flags));
featureFlagsService.onError((error) => console.log("error: ", error));

const flags = await featureFlagsService.fetchFlags([
  "showNews",
  "showPopup",
  "canDoSmth",
]);

const newFlags = await featureFlagsService.updateContext({
  userAgent: window.navigator.userAgent,
  lang: "en",
});
```

## ⛳️ Feature flags hook

```ts
const { isFetching, flags } = useFeatureFlags(["showNews"]);
```
