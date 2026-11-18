/**
 * @readable-header
 * FILE:      assets/agent-visual-indicator.js
 * WAS:       agent-visual-indicator.js-uaVFxZ2f.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     anthropic-extension
 * WHAT:      Content script drawing the phantom cursor, glow, Stop Claus button and active-tab-group pill in a closed shadow root.
 * ENTRY:     content script injected by manifest.json into <all_urls>, run_at document_idle; web-accessible resource (manifest.json) for <all_urls>
 * USED BY:   manifest.json (manifest)
 * NEEDS:     none
 */
/**
 * agent-visual-indicator (content script, injected into every page, top frame only)
 *
 * Draws the on-page UI that tells you Claude is controlling this tab:
 *
 *   - a "phantom cursor" that glides to wherever Claude is clicking
 *   - a pulsing orange glow around the edge of the viewport
 *   - a "Stop Claus" button at the bottom of the page
 *   - a "Claus is active in this tab group" pill (the "static indicator")
 *
 * Everything is rendered inside a closed shadow root so page scripts/styles
 * can't see or restyle it. The script never reads page content; it only
 * listens for messages from the extension's service worker and sends back a
 * few button-click messages (STOP_AGENT, SWITCH_TO_MAIN_TAB, ...).
 *
 * Messages handled (sent by the service worker):
 *   SHOW_AGENT_INDICATORS / HIDE_AGENT_INDICATORS   glow + stop button + cursor
 *   UPDATE_PHANTOM_CURSOR                           move the cursor to {x, y}
 *   HIDE_FOR_TOOL_USE / SHOW_AFTER_TOOL_USE         get out of the way while
 *                                                   Claude screenshots/clicks
 *   SHOW_STATIC_INDICATOR / HIDE_STATIC_INDICATOR   the "active in tab group" pill
 *   HIDE_STATIC_PILL                                remove just the pill
 */
(function () {
  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  const MAX_Z_INDEX = 2147483647;
  const CURSOR_Z_INDEX = MAX_Z_INDEX - 1;

  const CURSOR_TRANSITION_MS = 180; // keep in sync with the CSS transition below
  const CURSOR_TRANSITION_TIMEOUT_MS = 220; // fallback if "transitionend" never fires
  const FADE_OUT_MS = 300;
  const TOOL_USE_HIDE_FAILSAFE_MS = 5000; // un-hide automatically after this long
  const STATIC_HEARTBEAT_INTERVAL_MS = 5000;
  const STOP_ACK_TIMEOUT_MS = 1500; // how long to wait before assuming STOP was lost
  const STOP_FAILED_TOAST_MS = 3000;

  const STOP_BUTTON_ID = "claude-agent-stop-button";

  const CURSOR_ARROW_PATH = "M0 0 L0 18 L4.5 14 L7.5 21.5 L11 20 L8 13 L14 13 Z";

  const STOP_BUTTON_SHADOW =
    "0 40px 80px rgba(217, 119, 87, 0.24), 0 4px 14px rgba(217, 119, 87, 0.24)";

  const CLAUDE_LOGO_PATH =
    "M3.13946 10.6399L6.28757 8.87462L6.37405 8.73821L6.28757 8.6339H6.13189L5.60432 8.6018L3.80541 8.55366L2.24865 8.48947L0.735135 8.40923H0.492973L0.354595 8.32899L0.181622 8.1685L0.0345946 8.01605L0 7.85557L0.0345946 7.62287L0.138378 7.44634L0.224865 7.40622H0.354595L0.812973 7.44634L1.82486 7.51856L3.34703 7.62287L4.44541 7.68706L6.08 7.85557H6.33946L6.37405 7.75125L6.28757 7.68706L6.21838 7.62287L4.64432 6.55567L2.94054 5.4323L2.04973 4.78235L1.57405 4.45336L1.33189 4.14845L1.22811 3.92377L1.17622 3.69107L1.22811 3.47442L1.33189 3.28185L1.46162 3.13741L1.66054 2.99298H1.87676L2.24865 3.0331L2.39568 3.07322L2.99243 3.53059L4.26378 4.51755L5.92432 5.73721L6.16649 5.93781H6.27892V5.82548L6.16649 5.64092L5.26703 4.01204L4.30703 2.35105L3.87459 1.66098L3.76216 1.25176C3.7391 1.16082 3.69297 0.977332 3.69297 0.970913V0.762287L3.77946 0.505517L3.93513 0.240722L4.18595 0.0882648L4.4627 0H4.67892L4.83459 0.0240722L5.12865 0.0882648L5.4054 0.328987L5.82054 1.27583L6.48649 2.76028L7.52432 4.78235L7.82703 5.38415L7.99135 5.93781L8.05189 6.10632H8.15567V6.01003L8.24216 4.87061L8.39784 3.47442L8.55351 1.67703L8.6054 1.17151L8.85622 0.561685L8.9773 0.417252L9.21946 0.232698H9.35784L9.74703 0.417252L9.97189 0.665998L10.067 0.874624L10.0238 1.17151L9.83351 2.40722L9.46162 4.34102L9.21946 5.64092H9.35784L9.52216 5.47242L10.1795 4.60582L11.2778 3.22568L11.7622 2.68004L12.333 2.07823L12.6962 1.78937L13.0162 1.67703L13.3881 1.78937L13.7168 2.06219L13.8897 2.54363V2.76028L13.6649 3.32197L12.9557 4.22066L12.3676 4.98295L12.0043 5.56871L11.0011 7.02106V7.08526H11.1741L13.0768 6.67603L14.1059 6.49147L15.3341 6.28285L15.5762 6.34704L15.8876 6.53962L15.9481 6.80441L15.8876 7.12538L15.7319 7.34203L14.4173 7.66299L12.8778 7.97593L10.5854 8.51559C10.5705 8.51909 10.56 8.53236 10.56 8.54764C10.56 8.56468 10.573 8.57891 10.59 8.58044L11.6238 8.67402L12.0649 8.69809H13.1459L15.1611 8.85055L15.6886 9.19559L15.9481 9.39619L16 9.62086L15.9481 9.94985L15.8443 10.1023L15.4119 10.3029L15.1351 10.3591L14.0454 10.1023L11.4941 9.49248L10.6205 9.27583H10.4995V9.34804L11.2259 10.0622L12.5665 11.2658L14.2357 12.8225L14.3222 13.0953V13.2076L14.1059 13.5125L13.9243 13.5206L13.8811 13.4804L12.4108 12.3731L12.2984 12.325L11.84 11.8756L10.56 10.7924H10.4735V10.9047L10.7676 11.338L12.333 13.6891L12.4108 14.4112L12.2984 14.6439L11.8919 14.7884L11.667 14.7563L11.4508 14.7081L11.2605 14.5396L10.5254 13.4162L9.5827 11.9719L8.82162 10.672H8.79342C8.76039 10.672 8.73278 10.6972 8.7297 10.73L8.27676 15.5667L8.06919 15.8154L7.6454 16H7.58486L7.17838 15.6951L6.96216 15.1976L7.17838 14.2106L7.43784 12.9268L7.6454 11.9077L7.83567 10.6399L7.95187 10.2164C7.9548 10.2057 7.95069 10.1944 7.94161 10.1881C7.91157 10.1672 7.87034 10.1741 7.84878 10.2037L6.89297 11.5145L5.44 13.4804L4.28973 14.7081L4.01297 14.8205H3.80541L3.5373 14.5717V14.4514L3.58054 14.1304L3.84865 13.7372L5.44 11.7151L6.4 10.4554L7.01872 9.73222C7.04511 9.70139 7.04245 9.65523 7.0127 9.62763C7.00333 9.61894 6.98925 9.61773 6.97854 9.62471L2.75027 12.3811L1.99784 12.4774L1.66919 12.1725L1.71243 11.675L1.86811 11.5145L3.13946 10.6399Z";

  const CHAT_ICON_PATH =
    "M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5H3C2.79779 17.5 2.61549 17.3782 2.53809 17.1914C2.4607 17.0046 2.50349 16.7895 2.64648 16.6465L4.35547 14.9365C3.20124 13.6175 2.5 11.8906 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5ZM10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 11.7952 4.22659 13.4199 5.40332 14.5967L5.46582 14.6729C5.52017 14.7544 5.5498 14.8508 5.5498 14.9502C5.5498 15.0828 5.49709 15.2099 5.40332 15.3037L4.20703 16.5H10C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5ZM13.29 9.30371C13.3986 9.05001 13.6925 8.93174 13.9463 9.04004C14.2 9.14863 14.3183 9.44253 14.21 9.69629C13.8506 10.536 13.1645 11.25 12.25 11.25C11.6372 11.25 11.128 10.9289 10.75 10.4648C10.372 10.9289 9.86276 11.25 9.25 11.25C8.63724 11.25 8.12801 10.9289 7.75 10.4648C7.37198 10.9289 6.86276 11.25 6.25 11.25C5.97386 11.25 5.75 11.0261 5.75 10.75C5.75 10.4739 5.97386 10.25 6.25 10.25C6.58764 10.25 7.00448 9.97056 7.29004 9.30371L7.32422 9.2373C7.41431 9.09121 7.5749 9 7.75 9C7.9501 9 8.13123 9.11975 8.20996 9.30371L8.32227 9.53516C8.59804 10.0359 8.95442 10.25 9.25 10.25C9.58764 10.25 10.0045 9.97056 10.29 9.30371L10.3242 9.2373C10.4143 9.09121 10.5749 9 10.75 9C10.9501 9 11.1312 9.11975 11.21 9.30371L11.3223 9.53516C11.598 10.0359 11.9544 10.25 12.25 10.25C12.5876 10.25 13.0045 9.97056 13.29 9.30371Z";

  const CLOSE_ICON_PATH =
    "M15.1464 4.14642C15.3417 3.95121 15.6582 3.95118 15.8534 4.14642C16.0486 4.34168 16.0486 4.65822 15.8534 4.85346L10.7069 9.99997L15.8534 15.1465C16.0486 15.3417 16.0486 15.6583 15.8534 15.8535C15.6826 16.0244 15.4186 16.0461 15.2245 15.918L15.1464 15.8535L9.99989 10.707L4.85338 15.8535C4.65813 16.0486 4.34155 16.0486 4.14634 15.8535C3.95115 15.6583 3.95129 15.3418 4.14634 15.1465L9.29286 9.99997L4.14634 4.85346C3.95129 4.65818 3.95115 4.34162 4.14634 4.14642C4.34154 3.95128 4.65812 3.95138 4.85338 4.14642L9.99989 9.29294L15.1464 4.14642Z";

  const STOP_ICON_PATH =
    "M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm40-112v56a12,12,0,0,1-12,12H100a12,12,0,0,1-12-12V100a12,12,0,0,1,12-12h56A12,12,0,0,1,168,100Z";

  const SYSTEM_FONT_STACK =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  // Shadow DOM that holds every element we draw.
  let shadowHost = null;
  let shadowRoot = null;

  // Elements inside the shadow root (null while not shown).
  let glowBorder = null;
  let stopButtonContainer = null;
  let staticIndicator = null; // the "Claus is active in this tab group" pill
  let cursorElement = null; // wrapper div that gets moved around
  let styledCursorIcon = null; // the orange, glowing arrow on top of the plain one

  // Where the cursor was last *asked* to go, and where it actually is.
  let requestedCursorX = null;
  let requestedCursorY = null;
  let renderedCursorX = null;
  let renderedCursorY = null;

  // Keeps the tab "audible" so Chrome doesn't throttle it while Claude works.
  let keepAliveAudioContext = null;

  // Agent indicators (glow + stop button + cursor) are on.
  let agentIndicatorsActive = false;
  // Static pill mode is on.
  let staticIndicatorActive = false;
  // The user closed the pill with the X button.
  let staticIndicatorDismissed = false;

  // Temporarily hidden so Claude's own screenshots/clicks aren't obstructed.
  let hiddenForToolUse = false;
  let toolUseHideTimer = null;
  // What was visible when we hid, so we can restore the right things.
  let agentWasActiveBeforeHide = false;
  let staticWasActiveBeforeHide = false;

  let staticHeartbeatTimer = null;
  let stopAckTimer = null;
  let ownerTabId = null; // tab whose side panel owns the running agent

  // ---------------------------------------------------------------------------
  // Shadow DOM host
  // ---------------------------------------------------------------------------

  function createBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        all: initial !important;
        display: contents !important;
      }
      @keyframes claude-pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      #claude-agent-glow-border-inner {
        animation: claude-pulse 2s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        #claude-agent-glow-border-inner {
          animation: none;
        }
      }
    `;
    return style;
  }

  /**
   * Returns our shadow root, creating it on first use. Also (every call):
   *  - strips any attributes the page may have put on our host element
   *    (so a page can't hide it with style="display:none", for example), and
   *  - re-attaches the host to <body> if the page removed it.
   */
  function getShadowRoot() {
    if (!shadowRoot) {
      const host = document.createElement("div");
      const root = host.attachShadow({ mode: "closed" });
      root.appendChild(createBaseStyles());
      shadowHost = host;
      shadowRoot = root;
    }

    for (const attributeName of shadowHost.getAttributeNames()) {
      shadowHost.removeAttribute(attributeName);
    }

    const parent = document.body || document.documentElement;
    if (shadowHost.parentNode !== parent) {
      parent.appendChild(shadowHost);
    }
    return shadowRoot;
  }

  /** Adds an element to the overlay and keeps the host as the last (top-most) node on the page. */
  function addToOverlay(element) {
    getShadowRoot().appendChild(element);
    if (shadowHost.nextElementSibling) {
      shadowHost.parentNode.appendChild(shadowHost);
    }
  }

  // ---------------------------------------------------------------------------
  // Phantom cursor
  // ---------------------------------------------------------------------------

  function createCursorElement(x, y) {
    const container = document.createElement("div");
    container.id = "claude-phantom-cursor";
    container.setAttribute("aria-hidden", "true");
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: ${CURSOR_Z_INDEX};
      transform: translate3d(${x}px, ${y}px, 0);
      transition: transform ${CURSOR_TRANSITION_MS}ms cubic-bezier(0.2, 0, 0, 1);
      will-change: transform;
    `;

    const SVG_NS = "http://www.w3.org/2000/svg";

    const createArrowPath = (attributes) => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", CURSOR_ARROW_PATH);
      for (const [name, value] of Object.entries(attributes)) {
        path.setAttribute(name, value);
      }
      return path;
    };

    // An arrow = a thick outline path underneath + a fill path on top.
    const createArrow = (id, outlineColor, fillColor, extraStyle) => {
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.id = id;
      svg.setAttribute("width", "20");
      svg.setAttribute("height", "26");
      svg.setAttribute("viewBox", "0 0 20 26");
      svg.style.cssText = `position:absolute; top:0; left:0; overflow:visible; ${extraStyle}`;
      svg.appendChild(
        createArrowPath({
          stroke: outlineColor,
          "stroke-width": "3",
          "stroke-linejoin": "round",
          fill: outlineColor,
        }),
      );
      svg.appendChild(createArrowPath({ fill: fillColor }));
      return svg;
    };

    const plainArrow = createArrow("claude-phantom-cursor-plain", "white", "#111", "");
    const styledArrow = createArrow(
      "claude-phantom-cursor-styled",
      "#D97757",
      "#FAF9F5",
      "filter: drop-shadow(0 0 4px rgba(217,119,87,0.9)) drop-shadow(0 0 10px rgba(217,119,87,0.45));",
    );

    container.appendChild(plainArrow);
    container.appendChild(styledArrow);
    return { container, styledArrow };
  }

  /**
   * Moves the phantom cursor to (x, y) in viewport coordinates.
   * Resolves once the glide animation finishes (or immediately if there is
   * nothing to animate), so the caller can wait before clicking.
   */
  function movePhantomCursor(x, y) {
    const alreadyThere = cursorElement !== null && x === renderedCursorX && y === renderedCursorY;

    requestedCursorX = x;
    requestedCursorY = y;

    if (!agentIndicatorsActive) return Promise.resolve();

    // First move: create the cursor directly at the target (no animation).
    if (!cursorElement) {
      if (document.hidden) return Promise.resolve();
      const { container, styledArrow } = createCursorElement(x, y);
      cursorElement = container;
      styledCursorIcon = styledArrow;
      addToOverlay(cursorElement);
      renderedCursorX = x;
      renderedCursorY = y;
      return Promise.resolve();
    }

    getShadowRoot();
    cursorElement.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    renderedCursorX = x;
    renderedCursorY = y;

    if (alreadyThere || document.hidden) return Promise.resolve();

    return new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        cursorElement?.removeEventListener("transitionend", finish);
        resolve();
      };
      cursorElement.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, CURSOR_TRANSITION_TIMEOUT_MS);
    });
  }

  function removePhantomCursor() {
    cursorElement?.remove();
    cursorElement = null;
    styledCursorIcon = null;
  }

  // ---------------------------------------------------------------------------
  // Glow border
  // ---------------------------------------------------------------------------

  function createGlowBorder() {
    const outer = document.createElement("div");
    outer.id = "claude-agent-glow-border";
    outer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: ${CURSOR_Z_INDEX};
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    `;

    const inner = document.createElement("div");
    inner.id = "claude-agent-glow-border-inner";
    inner.style.cssText = `
      position: absolute;
      inset: 0;
      will-change: opacity;
      box-shadow:
        inset 0 0 15px rgba(217, 119, 87, 0.7),
        inset 0 0 25px rgba(217, 119, 87, 0.5),
        inset 0 0 35px rgba(217, 119, 87, 0.2);
    `;

    outer.appendChild(inner);
    return outer;
  }

  function showGlowBorder() {
    getShadowRoot();
    if (glowBorder) {
      glowBorder.style.display = "";
    } else {
      glowBorder = createGlowBorder();
      addToOverlay(glowBorder);
    }
    // Next frame, so the opacity transition actually plays.
    requestAnimationFrame(() => {
      if (glowBorder) glowBorder.style.opacity = "1";
    });
  }

  function hideGlowBorder() {
    if (agentIndicatorsActive || staticIndicatorActive) return;
    if (glowBorder) glowBorder.style.opacity = "0";
    setTimeout(() => {
      if (agentIndicatorsActive || staticIndicatorActive) return;
      if (glowBorder) {
        glowBorder.remove();
        glowBorder = null;
      }
    }, FADE_OUT_MS);
  }

  // ---------------------------------------------------------------------------
  // "Stop Claus" button
  // ---------------------------------------------------------------------------

  /** Brief toast shown if the STOP request doesn't seem to have reached Claude. */
  function showStopFailedToast() {
    try {
      const host = document.createElement("div");
      host.style.cssText =
        "position:fixed;bottom:88px;left:50%;transform:translateX(-50%);z-index:2147483646;pointer-events:none;";
      const root = host.attachShadow({ mode: "closed" });

      const message = document.createElement("div");
      message.textContent = "Stop didn’t reach Claus — close the side panel to stop.";
      message.style.cssText =
        "font:500 13px/1.3 system-ui,-apple-system,sans-serif;color:#141413;background:#FAF9F5;padding:8px 14px;border-radius:18px;box-shadow:0 4px 14px rgba(217,119,87,0.24);opacity:0;transition:opacity .15s ease-out;";
      root.appendChild(message);

      addToOverlay(host);
      requestAnimationFrame(() => (message.style.opacity = "1"));
      setTimeout(() => {
        message.style.opacity = "0";
        setTimeout(() => host.remove(), 200);
      }, STOP_FAILED_TOAST_MS);
    } catch (error) {
      // Cosmetic only; ignore.
    }
  }

  async function handleStopClick(event) {
    // Ignore clicks synthesized by page scripts.
    if (!event.isTrusted) return;

    await chrome.runtime.sendMessage({
      type: "STOP_AGENT",
      targetTabId: ownerTabId,
    });

    // If the agent is still marked active after a moment, the stop probably
    // got dropped: tell the service worker and show a hint to the user.
    if (stopAckTimer) clearTimeout(stopAckTimer);
    stopAckTimer = setTimeout(() => {
      stopAckTimer = null;
      if (!agentIndicatorsActive) return;
      try {
        chrome.runtime.sendMessage({
          type: "STOP_AGENT_DROPPED",
          targetTabId: ownerTabId,
        });
      } catch (error) {}
      showStopFailedToast();
    }, STOP_ACK_TIMEOUT_MS);
  }

  function createStopButton() {
    const container = document.createElement("div");
    container.id = "claude-agent-stop-container";
    container.style.cssText = `
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      z-index: ${MAX_Z_INDEX};
    `;

    const button = document.createElement("button");
    button.id = STOP_BUTTON_ID;
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" style="margin-right: 12px; vertical-align: middle;">
        <path d="${STOP_ICON_PATH}"></path>
      </svg>
      <span style="vertical-align: middle;">Stop Claus</span>
    `;
    // Starts off-screen and transparent; showAgentIndicators() slides it in.
    button.style.cssText = `
      position: relative;
      transform: translateY(100px);
      padding: 12px 16px;
      background: #FAF9F5;
      color: #141413;
      border: 0.5px solid rgba(31, 30, 29, 0.4);
      border-radius: 12px;
      font-family: ${SYSTEM_FONT_STACK};
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 40px 80px rgba(217, 119, 87, 0.24),
        0 4px 14px rgba(217, 119, 87, 0.24);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      user-select: none;
      pointer-events: auto;
      white-space: nowrap;
      margin: 0 auto;
    `;

    button.addEventListener("mouseenter", () => {
      if (!agentIndicatorsActive) return;
      button.style.background = "#F5F4F0";
      button.style.boxShadow = STOP_BUTTON_SHADOW;
    });
    button.addEventListener("mouseleave", () => {
      if (!agentIndicatorsActive) return;
      button.style.background = "#FAF9F5";
      button.style.boxShadow = STOP_BUTTON_SHADOW;
    });
    button.addEventListener("click", handleStopClick);

    container.appendChild(button);
    return container;
  }

  function setStopButtonVisible(visible) {
    if (!stopButtonContainer) return;
    const button = stopButtonContainer.querySelector(`#${STOP_BUTTON_ID}`);
    if (!button) return;
    button.style.transform = visible ? "translateY(0)" : "translateY(100px)";
    button.style.opacity = visible ? "1" : "0";
  }

  // ---------------------------------------------------------------------------
  // Keep-alive audio
  // ---------------------------------------------------------------------------

  /**
   * Starts a silent audio graph (a constant source into a gain of 0). An
   * "audible" tab is exempt from Chrome's background-tab throttling, so Claude
   * keeps running at full speed while you look at another tab. Browsers only
   * let an AudioContext start after a user gesture, so we also try to resume it
   * on the next click on the page.
   */
  function startKeepAliveAudio() {
    try {
      if (!keepAliveAudioContext) {
        keepAliveAudioContext = new AudioContext();

        const silentGain = keepAliveAudioContext.createGain();
        silentGain.gain.value = 0;
        silentGain.connect(keepAliveAudioContext.destination);

        const source = keepAliveAudioContext.createConstantSource();
        source.connect(silentGain);
        source.start();

        keepAliveAudioContext.addEventListener("statechange", () => {});
        document.addEventListener(
          "pointerdown",
          () => {
            if (agentIndicatorsActive) keepAliveAudioContext?.resume().catch(() => {});
          },
          { capture: true },
        );
      }
      keepAliveAudioContext.resume().catch(() => {});
    } catch (error) {}
  }

  // ---------------------------------------------------------------------------
  // Agent indicators: glow + stop button + cursor
  // ---------------------------------------------------------------------------

  function activateAgentIndicators() {
    agentIndicatorsActive = true;
    agentWasActiveBeforeHide = false;
    staticWasActiveBeforeHide = false;
    startKeepAliveAudio();
    if (!document.hidden && !hiddenForToolUse) renderAgentIndicators();
  }

  /** Draws (or re-shows) everything that belongs to the "agent is running" state. */
  function renderAgentIndicators() {
    showGlowBorder();

    // The stop button only makes sense if we know which tab owns the agent.
    if (ownerTabId != null) {
      if (stopButtonContainer) {
        stopButtonContainer.style.display = "";
      } else {
        stopButtonContainer = createStopButton();
        addToOverlay(stopButtonContainer);
      }
    } else if (stopButtonContainer) {
      stopButtonContainer.style.display = "none";
    }

    try {
      if (!cursorElement) {
        // Start in the middle of the viewport if Claude hasn't moved it yet.
        movePhantomCursor(
          requestedCursorX ?? Math.round(window.innerWidth / 2),
          requestedCursorY ?? Math.round(window.innerHeight / 2),
        );
      }
      if (styledCursorIcon) styledCursorIcon.style.display = "";
    } catch (error) {}

    requestAnimationFrame(() => setStopButtonVisible(true));
  }

  function deactivateAgentIndicators() {
    if (stopAckTimer) {
      clearTimeout(stopAckTimer);
      stopAckTimer = null;
    }
    if (!agentIndicatorsActive) return;

    agentIndicatorsActive = false;
    hideGlowBorder();
    keepAliveAudioContext?.suspend().catch(() => {});

    // The static pill still needs the page, so only the stop button/cursor go.
    if (staticIndicatorActive) {
      if (stopButtonContainer) {
        stopButtonContainer.remove();
        stopButtonContainer = null;
      }
      removePhantomCursor();
      return;
    }

    // Slide the stop button away, then remove everything once it's gone.
    setStopButtonVisible(false);
    setTimeout(() => {
      if (agentIndicatorsActive) return;
      if (stopButtonContainer) {
        stopButtonContainer.remove();
        stopButtonContainer = null;
      }
      removePhantomCursor();
    }, FADE_OUT_MS);
  }

  // ---------------------------------------------------------------------------
  // Hide while Claude uses a tool (so its screenshots/clicks aren't obstructed)
  // ---------------------------------------------------------------------------

  function cancelToolUseHide() {
    hiddenForToolUse = false;
    if (toolUseHideTimer) {
      clearTimeout(toolUseHideTimer);
      toolUseHideTimer = null;
    }
  }

  function hideForToolUse() {
    hiddenForToolUse = true;

    // Failsafe: if SHOW_AFTER_TOOL_USE never arrives, come back on our own.
    if (toolUseHideTimer) clearTimeout(toolUseHideTimer);
    toolUseHideTimer = setTimeout(() => {
      toolUseHideTimer = null;
      hiddenForToolUse = false;
      refreshIndicators();
    }, TOOL_USE_HIDE_FAILSAFE_MS);

    agentWasActiveBeforeHide = agentIndicatorsActive;
    staticWasActiveBeforeHide = staticIndicatorActive;

    if (glowBorder) glowBorder.style.display = "none";
    if (stopButtonContainer) stopButtonContainer.style.display = "none";
    if (styledCursorIcon) styledCursorIcon.style.display = "none";
    if (staticIndicator && staticIndicatorActive) staticIndicator.style.display = "none";
  }

  function showAfterToolUse() {
    cancelToolUseHide();
    if ((agentWasActiveBeforeHide || staticWasActiveBeforeHide) && glowBorder) {
      glowBorder.style.display = "";
    }
    if (agentWasActiveBeforeHide && stopButtonContainer) {
      stopButtonContainer.style.display = "";
    }
    if (styledCursorIcon) styledCursorIcon.style.display = "";
    if (staticWasActiveBeforeHide && staticIndicator) {
      staticIndicator.style.display = "";
    }
    agentWasActiveBeforeHide = false;
    staticWasActiveBeforeHide = false;
    refreshIndicators();
  }

  /** Re-draws whatever should be on screen (called when the tab becomes visible again, etc.). */
  function refreshIndicators() {
    if (document.hidden || hiddenForToolUse || agentWasActiveBeforeHide || staticWasActiveBeforeHide) {
      return;
    }
    if (agentIndicatorsActive) renderAgentIndicators();
    if (staticIndicatorActive) renderStaticIndicator();
  }

  // ---------------------------------------------------------------------------
  // Static indicator pill: "Claus is active in this tab group"  [chat] [x]
  // ---------------------------------------------------------------------------

  function createStaticIndicator() {
    const pill = document.createElement("div");
    pill.id = "claude-static-indicator-container";

    const tooltipStyle = `position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%); padding: 6px 12px; background: #30302E; color: #FAF9F5; border-radius: 6px; font-size: 12px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`;
    const iconButtonStyle = `position: relative; display: inline-flex; align-items: center; justify-content: center; padding: 6px; background: transparent; border: none; cursor: pointer; pointer-events: auto; vertical-align: middle; width: 32px; height: 32px; border-radius: 8px; transition: background 0.2s;`;

    pill.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; flex-shrink: 0; margin-right: 8px;">
        <path d="${CLAUDE_LOGO_PATH}" fill="#D97757"/>
      </svg>
      <span style="vertical-align: middle; color: #141413; font-size: 14px; display: inline-block;">Claus is active in this tab group</span>
      <div style="display: inline-block; width: 0.5px; height: 32px; background: rgba(31, 30, 29, 0.15); margin: 0 8px; vertical-align: middle;"></div>
      <button id="claude-static-chat-button" style="${iconButtonStyle}">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#141413" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; display: block;">
          <path d="${CHAT_ICON_PATH}" />
        </svg>
        <span id="claude-static-chat-tooltip" style="${tooltipStyle}">Open chat</span>
      </button>
      <button id="claude-static-close-button" style="${iconButtonStyle} margin-left: 4px;">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; display: block;">
          <path d="${CLOSE_ICON_PATH}" fill="#141413"/>
        </svg>
        <span id="claude-static-close-tooltip" style="${tooltipStyle}">Dismiss</span>
      </button>
    `;
    pill.style.cssText = `
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 6px 6px 16px;
      background: #FAF9F5;
      border: 0.5px solid rgba(31, 30, 29, 0.30);
      border-radius: 14px;
      box-shadow: 0 40px 80px 0 rgba(0, 0, 0, 0.15);
      z-index: ${MAX_Z_INDEX};
      pointer-events: none;
      white-space: nowrap;
      user-select: none;
      font-family: ${SYSTEM_FONT_STACK};
    `;

    // Wires hover highlight + tooltip + (trusted-only) click for one icon button.
    const wireIconButton = (buttonSelector, tooltipSelector, messageType) => {
      const button = pill.querySelector(buttonSelector);
      const tooltip = pill.querySelector(tooltipSelector);
      if (!button) return;

      button.addEventListener("mouseenter", () => {
        button.style.background = "#F0EEE6";
        if (tooltip) tooltip.style.opacity = "1";
      });
      button.addEventListener("mouseleave", () => {
        button.style.background = "transparent";
        if (tooltip) tooltip.style.opacity = "0";
      });
      button.addEventListener("click", async (event) => {
        if (!event.isTrusted) return;
        try {
          await chrome.runtime.sendMessage({ type: messageType });
        } catch (error) {}
      });
    };

    wireIconButton("#claude-static-chat-button", "#claude-static-chat-tooltip", "SWITCH_TO_MAIN_TAB");
    wireIconButton(
      "#claude-static-close-button",
      "#claude-static-close-tooltip",
      "DISMISS_STATIC_INDICATOR_FOR_GROUP",
    );

    return pill;
  }

  function activateStaticIndicator(dismissed) {
    staticIndicatorActive = true;
    staticIndicatorDismissed = dismissed;
    agentWasActiveBeforeHide = false;
    staticWasActiveBeforeHide = false;

    // While active, ping the service worker; if it stops answering (extension
    // reloaded/disabled) clean ourselves up so the pill doesn't get stuck.
    if (staticHeartbeatTimer) {
      clearInterval(staticHeartbeatTimer);
      staticHeartbeatTimer = null;
    }
    staticHeartbeatTimer = setInterval(async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          type: "STATIC_INDICATOR_HEARTBEAT",
        });
        if (!response?.success) deactivateStaticIndicator();
      } catch (error) {
        deactivateStaticIndicator();
      }
    }, STATIC_HEARTBEAT_INTERVAL_MS);

    if (document.hidden || hiddenForToolUse) {
      if (dismissed) removeStaticPill();
    } else {
      renderStaticIndicator();
    }
  }

  function renderStaticIndicator() {
    showGlowBorder();

    if (staticIndicatorDismissed) {
      removeStaticPill();
    } else if (staticIndicator) {
      staticIndicator.style.display = "";
    } else {
      staticIndicator = createStaticIndicator();
      addToOverlay(staticIndicator);
    }
  }

  /** Removes the pill only (the glow border stays). Marks it dismissed. */
  function removeStaticPill() {
    staticIndicatorDismissed = true;
    if (staticIndicator) {
      staticIndicator.remove();
      staticIndicator = null;
    }
  }

  function deactivateStaticIndicator() {
    if (!staticIndicatorActive) return;
    staticIndicatorActive = false;
    if (staticHeartbeatTimer) {
      clearInterval(staticHeartbeatTimer);
      staticHeartbeatTimer = null;
    }
    removeStaticPill();
    hideGlowBorder();
  }

  // ---------------------------------------------------------------------------
  // Wiring: messages from the service worker + page lifecycle
  // ---------------------------------------------------------------------------

  document.addEventListener("visibilitychange", refreshIndicators);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "SHOW_AGENT_INDICATORS":
        if ("ownerTabId" in message) ownerTabId = message.ownerTabId;
        if (message.afterToolUse) cancelToolUseHide();
        activateAgentIndicators();
        if (message.afterToolUse) refreshIndicators();
        sendResponse({ success: true });
        break;

      case "HIDE_AGENT_INDICATORS":
        deactivateAgentIndicators();
        sendResponse({ success: true });
        break;

      case "UPDATE_PHANTOM_CURSOR":
        // Async: reply once the cursor has finished gliding.
        movePhantomCursor(message.x, message.y).then(() => sendResponse({ success: true }));
        return true;

      case "HIDE_FOR_TOOL_USE":
        hideForToolUse();
        sendResponse({ success: true });
        break;

      case "SHOW_AFTER_TOOL_USE":
        showAfterToolUse();
        sendResponse({ success: true });
        break;

      case "SHOW_STATIC_INDICATOR":
        if (message.afterToolUse) cancelToolUseHide();
        activateStaticIndicator(message.dismissed === true);
        if (message.afterToolUse) refreshIndicators();
        sendResponse({ success: true });
        break;

      case "HIDE_STATIC_INDICATOR":
        deactivateStaticIndicator();
        sendResponse({ success: true });
        break;

      case "HIDE_STATIC_PILL":
        removeStaticPill();
        sendResponse({ success: true });
        break;
    }
  });

  // Tear everything down when the page is navigated away or closed.
  window.addEventListener("beforeunload", (event) => {
    if (!event.isTrusted) return;
    deactivateAgentIndicators();
    deactivateStaticIndicator();
    removePhantomCursor();
    keepAliveAudioContext?.close().catch(() => {});
    keepAliveAudioContext = null;
  });
})();
