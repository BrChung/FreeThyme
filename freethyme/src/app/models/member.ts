// This model differs to users as it describes the individual members in a calendar room
export interface Member {
  UID: string;
  nickname: string;
  roles: Roles;
  combined: string; //ex (owner Tommy = 1_Tommy)
}

export interface Roles {
  viewer?: boolean;
  member?: boolean;
  admin?: boolean;
}

// Only one owner per calendar group
// Admin has same privileges as owner but may not delete the calendar
// Member has access to add calendars and suggest meeting times
// Viewers can only view calendar
