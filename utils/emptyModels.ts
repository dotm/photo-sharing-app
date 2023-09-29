import { stlUserDetail } from "./type"

export function createEmptyUserDetail(userId: string): stlUserDetail {
  return {
    userId,
    userName: "",
    profilePhotoUrl: "",
  }
}