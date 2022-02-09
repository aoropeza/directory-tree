const app = require("../src/application");

describe("directory Tree", () => {
  describe("making operations", () => {
    test("CREATE fruits", () => expect(app.create({ dir: "fruits" })).toBe("CREATE fruits"));
    test("CREATE vegetables", () =>
      expect(app.create({ dir: "vegetables" })).toBe("CREATE vegetables"));
    test("CREATE grains", () => expect(app.create({ dir: "grains" })).toBe("CREATE grains"));
    test("CREATE fruits/apples", () =>
      expect(app.create({ dir: "fruits/apples" })).toBe("CREATE fruits/apples"));
    test("CREATE fruits/apples/fuji", () =>
      expect(app.create({ dir: "fruits/apples/fuji" })).toBe("CREATE fruits/apples/fuji"));
    test("LIST", () => expect(app.list()).toMatchSnapshot());
    test("CREATE grains/squash", () =>
      expect(app.create({ dir: "grains/squash" })).toBe("CREATE grains/squash"));
    test("MOVE grains/squash vegetables", () =>
      expect(app.move({ source: "grains/squash", target: "vegetables" })).toBe(
        "MOVE grains/squash vegetables"
      ));
    test("CREATE foods", () => expect(app.create({ dir: "foods" })).toBe("CREATE foods"));
    test("MOVE grains foods", () =>
      expect(app.move({ source: "grains", target: "foods" })).toBe("MOVE grains foods"));
    test("MOVE fruits foods", () =>
      expect(app.move({ source: "fruits", target: "foods" })).toBe("MOVE fruits foods"));
    test("MOVE vegetables foods", () =>
      expect(app.move({ source: "vegetables", target: "foods" })).toBe("MOVE vegetables foods"));
    test("LIST", () => expect(app.list()).toMatchSnapshot());
    test("DELETE foods/fruits/apples", () =>
      expect(app.delete({ dir: "foods/fruits/apples" })).toBe("DELETE foods/fruits/apples"));
    test("LIST", () => expect(app.list()).toMatchSnapshot());
  });
});
