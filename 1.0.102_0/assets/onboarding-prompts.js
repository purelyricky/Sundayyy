/**
 * @readable-header
 * FILE:      assets/onboarding-prompts.js
 * WAS:       onboarding-prompts-CJtFEMjA.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     anthropic-extension
 * WHAT:      Data table of onboarding starter prompts with a getOnboardingPrompt lookup.
 * ENTRY:     web-accessible resource (manifest.json) for https://*.claude.ai/*, https://claude.ai/*
 * USED BY:   assets/content-script.js (static import)
 *            assets/service-worker.js (static import)
 *            manifest.json (manifest)
 * NEEDS:     none
 * EXPORTS:   t  (export names are unchanged from the original; other files import them by these names)
 */
/**
 * onboarding-prompts (shared module)
 *
 * A fixed table of starter prompts for the extension's onboarding: three
 * practice challenges and six example use cases. `getOnboardingPrompt(taskId)`
 * returns the prompt text for a known id, or undefined.
 *
 * Pure data + a lookup: no network, no messaging, no page access. It is
 * imported by content-script.ts (to validate a task id) and is also listed as
 * a web-accessible resource for claude.ai pages.
 *
 * Exported as `t` (the name other bundled files import).
 */
var ONBOARDING_PROMPTS = {
  "challenge-email":
    "I'm learning how to use the browser extension, and need help with this practice challenge.\n\nCan you look at the demo inbox on this page and help me archive only the meeting RSVP emails? Look for emails with 'Accepted:', 'Declined:', or 'Tentative:' in the subject line. For each RSVP email, click the gray folder/archive icon button that appears to the right of the checkbox (it looks like a filing cabinet or folder icon). Leave other work emails in the inbox. Take a screenshot after archiving each RSVP.",
  "challenge-form":
    "I’m learning how to use the browser extension, and need help with this practice challenge.\n\nCan you take a look at this form and help me fill it out with realistic restaurant reservation information? For dropdown fields, please use the form input action to fill them in.",
  "challenge-equipment":
    "I’m learning how to use the browser extension, and need help with this practice challenge.\n\nLooking at these various items, can you help me select the ones that would be good video equipment for creating content? Please click on the equipment you’d recommend.",
  "usecase-zillow":
    "Navigate to Zillow and find me a 2-bedroom apartment in San Francisco under $4000/month. Filter for places available within the next 30 days and show me the top 3 options with photos.",
  "usecase-calendar":
    "Go to my Google Calendar and find a 1-hour slot this week when both [name] and I are free. Once you find a good time, create a meeting called [name] and send the invite.",
  "usecase-gdocs":
    "Go to Google docs and open the latest document. Read through all the comments and feedback, then give me a summary of the main concerns and create a prioritized action item list of what needs to be addressed.",
  "usecase-gmail":
    "Go through my recent Gmail and find email lists or promotional emails that I haven’t opened in the last 3 months. Help me unsubscribe from these via the unsubcribe button at the top of the email.",
  "usecase-doordash":
    "Navigate to DoorDash and find a highly rated restaurant in San Francisco that serves garlic noodles. Browse their menu, add garlic noodles and any recommended sides to my cart, but don’t complete the order yet.",
  "usecase-salesforce":
    "Go to Salesforce and find the lead for [name]. Convert this lead into a sales opportunity with the opportunity name [opportunity name] and set the stage to ‘Qualification’.",
};

/** Prompt text for a task id, or undefined if the id is empty/unknown. */
function getOnboardingPrompt(taskId) {
  if (taskId)
    return Object.hasOwn(ONBOARDING_PROMPTS, taskId)
      ? ONBOARDING_PROMPTS[taskId]
      : void 0;
}
export { getOnboardingPrompt as t };
