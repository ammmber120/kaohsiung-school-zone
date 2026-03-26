export type SchoolZoneRule = {
  village: string;
  elementarySchool: string;
  juniorHighSchool: string;
  notes?: string;
};

export const schoolZones: SchoolZoneRule[] = [
  {
    village: "中原里",
    elementarySchool: "鹽埕國小",
    juniorHighSchool: "鹽埕國民中學",
    notes: "依高雄市115學年度官方學區表整理",
  },
];