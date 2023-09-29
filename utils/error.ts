export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

const rowLevelSecurityErrorMessage = "new row violates row-level security policy"
export class RowLevelSecurityError extends AuthorizationError {
  constructor() {
    super(rowLevelSecurityErrorMessage);
  }
}

export function handleErrorInFrontend(error: any){
  if(error === null || error === undefined){
    return
  }
  const errorMessage = ((error.message ?? "") as string)
  const errJson = JSON.stringify(error,null,2)
  if(errJson === "{}"){
    return //early return because cancel request to Next.js API (no alert)
  }
  let displayedError = ''
  if((error.code === "42501") || errorMessage.includes(rowLevelSecurityErrorMessage)){
    displayedError += "Failed updating data. Please re-login."
  }else if(errorMessage === "TypeError: Failed to fetch"){
    displayedError += `Failed to fetch data. Make sure you have internet access.`
  }
  displayedError += `\n\nerror: ${errJson}`
  alert(displayedError)
}