import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function GravitySimulator() {
  const { unityProvider } = useUnityContext({
    loaderUrl: process.env.PUBLIC_URL + "/gravity/Build/gravity.loader.js",
    dataUrl: process.env.PUBLIC_URL + "/gravity/Build/gravity.data.gz",
    frameworkUrl: process.env.PUBLIC_URL + "/gravity/Build/gravity.framework.js.gz",
    codeUrl: process.env.PUBLIC_URL + "/gravity/Build/gravity.wasm.gz",
  });

  return <Unity unityProvider={unityProvider} />;
}
export default GravitySimulator;