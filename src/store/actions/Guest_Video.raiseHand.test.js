import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axiosInstance from "../../commen/functions/axiosInstance";
import { raiseUnRaisedHandMainApi } from "./Guest_Video";
import * as actions from "../action_types";

/**
 * Action-level test of raise / lower hand — the request the server receives and
 * the state the UI is driven from. The HTTP layer and the heavy neighbours are
 * mocked, so this proves the action's behaviour, NOT the video call itself.
 */

// vitest hoists vi.mock above the imports at the top of this file, so the real
// modules are never loaded. Only what Guest_Video.js touches at the point of use
// is provided; everything else in those modules is unused here.
vi.mock("../../commen/functions/axiosInstance", () => ({
  default: { post: vi.fn() },
}));
vi.mock("./Auth_action", () => ({ RefreshToken: vi.fn() }));
vi.mock("../../hooks/useClipBoard", () => ({ default: vi.fn() }));
vi.mock("../../commen/functions/mqttconnection_guest", () => ({
  mqttConnectionGuestUser: vi.fn(),
}));
vi.mock("./VideoFeature_actions", () => ({
  setRaisedUnRaisedParticiant: (value) => ({ type: "TEST_SET_RAISED", value }),
}));

const t = (key) => key;
const navigate = vi.fn();

/** Server answers RaiseUnRaiseHand_01 (success), _02 (call not found), etc. */
const serverReplies = (suffix) =>
  axiosInstance.post.mockResolvedValue({
    data: {
      responseCode: 200,
      responseResult: {
        isExecuted: true,
        responseMessage: `Meeting_MeetingServiceManager_RaiseUnRaiseHand_${suffix}`,
      },
    },
  });

/** The RequestMethod / RequestData the action actually posted. */
const lastPosted = () => {
  const [, form] = axiosInstance.post.mock.calls.at(-1);
  return {
    method: form.get("RequestMethod"),
    body: JSON.parse(form.get("RequestData")),
  };
};

/** The thunk does not return its promise, so wait for the dispatches to land. */
const run = async (data) => {
  const dispatch = vi.fn((a) => a);
  raiseUnRaisedHandMainApi(navigate, t, data)(dispatch);
  return dispatch;
};

const types = (dispatch) => dispatch.mock.calls.map(([a]) => a.type);

beforeEach(() => {
  axiosInstance.post.mockReset();
  localStorage.clear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe("raise hand", () => {
  it("posts RaiseUnRaiseHand with the real ids and IsHandRaised true", async () => {
    serverReplies("01");
    const dispatch = await run({ RoomID: "4821", UID: "guid-abc", IsHandRaised: true });
    await vi.waitFor(() => expect(types(dispatch)).toContain(actions.RAISE_UNRAISED_HAND_SUCCESS));

    expect(lastPosted()).toEqual({
      method: "ServiceManager.RaiseUnRaiseHand",
      body: { RoomID: "4821", UID: "guid-abc", IsHandRaised: true },
    });
    // The UI is driven from this — it must flip to "raised".
    expect(dispatch).toHaveBeenCalledWith({ type: "TEST_SET_RAISED", value: true });
    expect(localStorage.getItem("handStatus")).toBe("true");
  });
});

describe("lower hand", () => {
  it("posts IsHandRaised false and flips the UI back", async () => {
    serverReplies("01");
    const dispatch = await run({ RoomID: "4821", UID: "guid-abc", IsHandRaised: false });
    await vi.waitFor(() => expect(types(dispatch)).toContain(actions.RAISE_UNRAISED_HAND_SUCCESS));

    expect(lastPosted().body).toEqual({ RoomID: "4821", UID: "guid-abc", IsHandRaised: false });
    expect(dispatch).toHaveBeenCalledWith({ type: "TEST_SET_RAISED", value: false });
    expect(localStorage.getItem("handStatus")).toBe("false");
  });

  it("raise then lower round-trips through the same ids", async () => {
    serverReplies("01");
    const ids = { RoomID: "4821", UID: "guid-abc" };

    const d1 = await run({ ...ids, IsHandRaised: true });
    await vi.waitFor(() => expect(localStorage.getItem("handStatus")).toBe("true"));

    const d2 = await run({ ...ids, IsHandRaised: false });
    await vi.waitFor(() => expect(localStorage.getItem("handStatus")).toBe("false"));

    const flips = [d1, d2].flatMap((d) => d.mock.calls.map(([a]) => a).filter((a) => a.type === "TEST_SET_RAISED"));
    expect(flips.map((a) => a.value)).toEqual([true, false]);
    expect(axiosInstance.post).toHaveBeenCalledTimes(2);
  });

  it("leaves the UI untouched when the server rejects it (call not found)", async () => {
    serverReplies("02");
    localStorage.setItem("handStatus", "true");
    const dispatch = await run({ RoomID: "4821", UID: "guid-abc", IsHandRaised: false });
    await vi.waitFor(() => expect(types(dispatch)).toContain(actions.RAISE_UNRAISED_HAND_FAIL));

    // No optimistic flip: the hand is still shown as raised, because it still is.
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: "TEST_SET_RAISED" }));
    expect(localStorage.getItem("handStatus")).toBe("true");
  });
});

describe("null-id guard", () => {
  it("does not send the exact payload from the bug", async () => {
    const dispatch = await run({ RoomID: "null", UID: "null", IsHandRaised: true });

    expect(axiosInstance.post).not.toHaveBeenCalled();
    expect(types(dispatch)).toEqual([actions.RAISE_UNRAISED_HAND_FAIL]);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("missing RoomID and UID"),
      expect.anything(),
    );
  });

  it("guards lowering too, and names only the field that is missing", async () => {
    const dispatch = await run({ RoomID: "4821", UID: "undefined", IsHandRaised: false });

    expect(axiosInstance.post).not.toHaveBeenCalled();
    expect(types(dispatch)).toEqual([actions.RAISE_UNRAISED_HAND_FAIL]);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("missing UID"),
      expect.anything(),
    );
  });
});
