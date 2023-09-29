import { AppVersionResponseData } from "@/pages/api/appVersion";
import { NextRouter } from "next/router";

export async function refreshIfNewAppVersionAvailable(
  appVersion: string,
  setAppVersion: (value: string)=>void,
  router: NextRouter,
) {
  if(appVersion !== "kodok"){
    return //disable for now
  }
  const response = await fetch(
    `/api/appVersion`,
    {
      method: "GET",
    }
  );
  const respJson: AppVersionResponseData = await response.json();
  const currentVersion = respJson.version
  if(appVersion !== currentVersion){
    alert("We'll refresh this page so you can get the latest version of our app.")
    setAppVersion(currentVersion)
    router.reload()
  }
}
