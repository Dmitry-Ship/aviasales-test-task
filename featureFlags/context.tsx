import React, { createContext, useContext, useEffect, useState } from "react";
import {
  IFeatureFlagsService,
  flags,
  context,
  FeatureFlagsService,
} from "./index";

type featureFlags = {
  flags: null | flags;
  isFetching: boolean;
  fetch: (flags: string[]) => Promise<flags | null>;
  setFlags: (flags: flags) => void;
  updateContext: (context: context) => void;
};

export const useProviderFeatureFlags = (
  featureFlagsService: IFeatureFlagsService
): featureFlags => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [flags, setFlags] = useState<flags | null>(null);

  featureFlagsService.onFetched(() => {
    setIsFetching(false);
  });

  featureFlagsService.onError((error) => {
    console.log("error: ", error);
  });

  return {
    isFetching,
    flags,
    setFlags,
    fetch: featureFlagsService.fetchFlags,
    updateContext: featureFlagsService.updateContext,
  };
};

const featureFlagsContext = createContext<featureFlags>({
  flags: null,
  isFetching: true,
  setFlags: () => {},
  fetch: (flags: string[]) =>
    new Promise((resolveOuter) => {
      resolveOuter(
        new Promise((resolveInner) => {
          setTimeout(resolveInner, 1000);
        })
      );
    }),
  updateContext: () => {},
});

export const ProvideFeatureFlags: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const featureFlagsService = new FeatureFlagsService();

  const fflags = useProviderFeatureFlags(featureFlagsService);
  return (
    <featureFlagsContext.Provider value={fflags}>
      {children}
    </featureFlagsContext.Provider>
  );
};

export const useFeatureFlags = (newFlags: string[]) => {
  const { flags, isFetching, fetch, updateContext, setFlags } =
    useContext(featureFlagsContext);

  useEffect(() => {
    const getFlags = async () => {
      const flags = await fetch(newFlags);
      setFlags(flags || []);
    };
    getFlags();
  }, []);

  return { flags, isFetching, updateContext };
};
