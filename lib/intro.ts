// DG Click — intro choreography handoff. The loader (EntryCurtain) fires this
// the moment its splash begins sliding down; the Hero listens and starts the
// camera drop + (delayed) text reveal so the two scenes hand off as one gesture.
// A window flag covers the race where the Hero mounts/checks after the event.

export const INTRO_HANDOFF = "dgclick:intro-handoff";

export function startIntroHandoff() {
  if (typeof window === "undefined") return;
  (window as { __dgIntroHandoff?: boolean }).__dgIntroHandoff = true;
  window.dispatchEvent(new Event(INTRO_HANDOFF));
}

export function introHandoffDone() {
  return (
    typeof window !== "undefined" &&
    !!(window as { __dgIntroHandoff?: boolean }).__dgIntroHandoff
  );
}
