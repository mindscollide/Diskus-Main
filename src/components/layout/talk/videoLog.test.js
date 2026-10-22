import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logVideoApiResponse } from "./videoLog";

const request = (method) => {
  const form = new FormData();
  form.append("RequestMethod", method);
  form.append("RequestData", JSON.stringify({ MeetingID: 7 }));
  return { data: form };
};
const ok = (message) => ({
  responseCode: 200,
  responseResult: { isExecuted: true, responseMessage: message },
});

describe("logVideoApiResponse", () => {
  let spy;
  beforeEach(() => {
    spy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => spy.mockRestore());

  it("ignores successful video responses", () => {
    logVideoApiResponse(
      request("ServiceManager.InitiateVideoCall"),
      ok("Video_VideoServiceManager_InitiateVideoCall_01"),
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it("ignores failures of non-video methods", () => {
    logVideoApiResponse(request("ServiceManager.GetAllMeetings"), {
      responseCode: 500,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("ignores 417, which the thunks retry after refreshing the token", () => {
    logVideoApiResponse(request("ServiceManager.LeaveCall"), {
      responseCode: 417,
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("logs a non-200 responseCode and isExecuted false", () => {
    logVideoApiResponse(request("ServiceManager.LeaveCall"), {
      responseCode: 500,
    });
    logVideoApiResponse(request("ServiceManager.LeaveCall"), {
      responseCode: 200,
      responseResult: { isExecuted: false },
    });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toMatch(
      /^\[VideoLog\] \S+ \[Diskus\] \[API\] ServiceManager\.LeaveCall failed: responseCode 500/,
    );
  });

  it("logs documented failure codes even on a 200 response", () => {
    logVideoApiResponse(
      request("ServiceManager.JoinMeetingVideoRequest"),
      ok("Meeting_MeetingServiceManager_JoinMeetingVideoRequest_04"),
    );
    logVideoApiResponse(
      request("ServiceManager.JoinMeetingVideoRequest"),
      ok("Meeting_MeetingServiceManager_JoinMeetingVideoRequest_02"),
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain("JoinMeetingVideoRequest_04");
  });

  it("logs network errors with the request data", () => {
    logVideoApiResponse(
      request("ServiceManager.JoinMeetingVideoRequest"),
      undefined,
      new Error("Network Error"),
    );
    expect(spy.mock.calls[0][0]).toContain(
      "JoinMeetingVideoRequest request failed: Network Error",
    );
    expect(spy.mock.calls[0][1].request).toContain("MeetingID");
  });
});
