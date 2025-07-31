import type { BasicUserResponse } from "./BasicUserResponse";

export interface UserListResponse {
  totalNumberOfUsers: number;
  users: BasicUserResponse[];
}
