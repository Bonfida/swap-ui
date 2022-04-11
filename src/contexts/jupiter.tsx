import React, { useContext, useEffect, useMemo, useState } from "react";
import { Configuration, DefaultApi } from "@jup-ag/api";
import { TokenInfo, TokenListProvider } from "@solana/spl-token-registry";
import { CHAIN_ID } from "../constants";
import axios from "axios";

type RouteMap = Map<string, string[]>;

interface JupiterApiContext {
  api: DefaultApi;
  loaded: boolean;
  tokenMap: Map<string, TokenInfo>;
  routeMap: RouteMap;
}

const JupiterApiContext = React.createContext<JupiterApiContext | null>(null);

const getTokens = async () => {
  const { data } = await axios.get("https://cache.jup.ag/tokens");
  return data as TokenInfo[];
};

const getTopTokens = async () => {
  const { data } = await axios.get("https://cache.jup.ag/top-tokens");
  return data as string[];
};

export const JupiterApiProvider: React.FC<{}> = ({ children }) => {
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
  const [routeMap, setRouteMap] = useState<RouteMap>(new Map());
  const [loaded, setLoaded] = useState(false);

  const api = useMemo(() => {
    const config = new Configuration({ basePath: "https://quote-api.jup.ag" });
    return new DefaultApi(config);
  }, []);

  useEffect(() => {
    (async () => {
      let [tokenList, topTokens, indexedRouteMapResult] = await Promise.all([
        getTokens(),
        getTopTokens(),
        api.v1IndexedRouteMapGet(),
      ]);

      tokenList = tokenList; //.filter((e) => !!topTokens.includes(e.address));

      const { indexedRouteMap = {}, mintKeys = [] } = indexedRouteMapResult;

      const routeMap = Object.keys(indexedRouteMap).reduce((routeMap, key) => {
        routeMap.set(
          mintKeys[Number(key)],
          indexedRouteMap[key].map((index) => mintKeys[index])
        );
        return routeMap;
      }, new Map<string, string[]>());

      setTokenMap(
        tokenList.reduce((map, item) => {
          map.set(item.address, item);
          return map;
        }, new Map())
      );
      setRouteMap(routeMap);
      setLoaded(true);
    })();
  }, []);

  return (
    <JupiterApiContext.Provider value={{ api, routeMap, tokenMap, loaded }}>
      {children}
    </JupiterApiContext.Provider>
  );
};

export const useJupiterApiContext = () => {
  const context = useContext(JupiterApiContext);

  if (!context) {
    throw new Error(
      "useJupiterApiContext must be used within a JupiterApiProvider"
    );
  }

  return context;
};
