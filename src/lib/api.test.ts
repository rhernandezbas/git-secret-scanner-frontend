import { startScan, getFindings } from "./api";

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
  global.fetch = jest.fn();
  global.WebSocket = jest.fn().mockImplementation(() => ({
    onopen: null,
    onmessage: null,
    onerror: null,
    onclose: null,
    close: jest.fn(),
  })) as unknown as typeof WebSocket;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe("startScan", () => {
  it("calls POST /scan with correct body", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "scan started" }),
    });

    await startScan({ username: "torvalds", provider: "github" });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/scan"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "torvalds", provider: "github" }),
      })
    );
  });

  it("throws on non-ok response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "bad request",
    });

    await expect(startScan({ username: "", provider: "github" })).rejects.toThrow();
  });
});

describe("getFindings", () => {
  it("returns ScanResult array", async () => {
    const mockResults = [{ repo: { name: "test-repo" }, findings: [] }];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    });

    const results = await getFindings();
    expect(results).toEqual(mockResults);
  });

  it("returns empty array on error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network error"));
    const results = await getFindings();
    expect(results).toEqual([]);
  });
});
