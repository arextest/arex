const publicSnippet = [
  {
    name: 'Send a request',
    text: `pm.sendRequest("https://postman-echo.com/get", function (err, response) {
    console.log(response.json());
});
`,
  },
  {
    name: 'Status code is 200',
    text: `pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
`,
  },
  {
    name: 'Get an environment variable',
    text: `pm.environment.get("variable_key");
`,
  },
  {
    name: 'Set an environment variable',
    text: `pm.environment.set("variable_key", "variable_value");
`,
  },
];
export const preTestCodeSnippet = [...publicSnippet];

export const testCodeSnippet = [
  ...publicSnippet,
  {
    name: 'Response body: JSON value check',
    text: `pm.test("Your test name", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.value).to.eql(100);
  });
`,
  },
  {
    name: 'Response headers: Content-Type header check',
    text: `pm.test("Content-Type is present", function () {
    pm.response.to.have.header("Content-Type");
});
`,
  },
];
