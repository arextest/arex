export enum Route {
  ROUTES = "routes",
  PORTAL = "portal",
  DASHBOARD = "dashboard",
  REGRESSION_TEST = "regressionTest",
  REPORT = "report",
  ERROR_404 = "404",
  DETAIL_ANALYSIS = "detailAnalysis",
  EXECUTION_RECORDS = "executionRecords"
}

export enum User {
  ORG = "org",
  EMAIL = "email",
  PASSWORD = "password",
  CAPTCHA = "captcha",
  NAME = "name"
}

export enum Lang {
  EN = "en",
  ZH = "zh"
}

export enum Env {
  FAT = "fat",
  PRO = "pro"
}

export enum Switch {
  ON = "ON",
  OFF = "OFF"
}

export enum Tag {
  ORANGE = "orange-tag",
  BLUE = "blue-tag",
  GREEN = "green-tag",
  GREY = "grey-tag"
}

export enum Style {
  SCREEN_WIDTH = "screenWidth"
}

export enum Config {
  APP = "app"
}

export enum Date {
  HH_MM_SS = "HH:mm:ss",
  HH_MM = "HH:mm"
}

export enum Result {
  SUCCESS = "success",
  ERROR = "error"
}

export const options = [
  {label: "MAIN_SERVICE", value: 0},
  {label: "SOA", value: 1},
  {label: "QMQ", value: 2},
  {label: "DB", value: 3},
  {label: "REDIS", value: 4},
  {label: "DYNAMIC", value: 5},
  {label: "HTTP", value: 6},
  {label: "ABT", value: 7},
  {label: "Q_CONFIG", value: 8},
  {label: "UNDEFINE", value: 9},
  {label: "MAIN_QMQ", value: 10},
  {label: "INVALID_CASE", value: 11}
]

export const states = [
  {label: "init", class: "grey-tag", value: 0},
  {label: "running", class: "orange-tag", value: 1},
  {label: "done", class: "green-tag", value: 2},
  {label: "interrupted", class: "red-tag", value: 3},
  {label: "cancelled", class: "blue-tag", value: 4}
]

export const diffResultCode = [
  {label: "caseStatusSuccess", value: 0, classCss: "green-template"},
  {label: "caseStatusFailed", value: 1, classCss: "red-template"},
  {label: "caseStatusException", value: 2, classCss: "red-template"},
]

export const Dates = [
  "everyDay", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
]
