export interface Assignment {
  id: number,
  name: string,
  groupId: string,
  compositionId: number,
  isMultiUser: number,
  close: number,
  executionId: number,
  timestamp_c: string,
  timestamp_m: string
}

export interface Execution {
  id: number,
  compositionId: number,
  assignmentId: number,
  userId: number,
  realname: string,
  comment: string,
  timestamp_c: string,
  timestamp_m: string
}
