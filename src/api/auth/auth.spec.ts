import { eq } from "drizzle-orm";
import { dbService } from "../../services/db/index.js";
import { user } from "../../services/db/schema.js";
import auth from "./auth.js";

const { dbClient } = dbService();

const mockedFetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
vi.stubGlobal("fetch", mockedFetch);

describe("/auth", () => {
  beforeEach(() => {
    mockedFetch.mockClear();
  });

  it("Should create a new user", async () => {
    const res = await auth.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
      }),
    });

    const dbRes = await dbClient.query.user.findFirst({
      where: eq(user.email, "john.doe@example.com"),
    });

    // Ensure that the response is OK
    expect(res.status).toBe(200);

    // Ensure that the user was created
    expect(dbRes).toBeTruthy();
    expect(dbRes?.email).toBe("john.doe@example.com");

    // Ensure that the email was sent
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });
});
