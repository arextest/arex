export const test24HourString = (time: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

export const testEmail = (email: string) =>
  /(?=^.{3,256}$)^([\w-]+(\.[\w-]+)*)@[a-zA-Z0-9][a-zA-Z0-9-]*\.[A-Za-z]{2,6}$/.test(email);
