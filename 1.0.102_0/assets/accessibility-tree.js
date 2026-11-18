/**
 * @readable-header
 * FILE:      assets/accessibility-tree.js
 * WAS:       accessibility-tree.js-B-oUarrX.js (name in the original Vite build; only the name and formatting changed)
 * OWNER:     anthropic-extension
 * WHAT:      Content script defining window.__generateAccessibilityTree, which produces the text outline used by the read_page tool.
 * ENTRY:     content script injected by manifest.json into <all_urls> (all frames), run_at document_start; web-accessible resource (manifest.json) for <all_urls>
 * USED BY:   manifest.json (manifest)
 * NEEDS:     none
 */
/**
 * accessibility-tree (content script, injected into ALL frames of every page
 * at document_start)
 *
 * What it does:
 *   Defines one global function, `window.__generateAccessibilityTree`, which
 *   walks the page DOM and returns a compact, indented text outline of the
 *   page's elements (role, label, ref id, href/type/placeholder). This is what
 *   Claude "reads" when it uses its read_page tool.
 *
 * What it does NOT do:
 *   - It makes no network requests and sends no messages (no fetch,
 *     XMLHttpRequest, chrome.runtime, postMessage...). Merely loading this
 *     script does nothing except define the function and three globals.
 *   - The function only runs when something else calls it (the extension's
 *     service worker invokes it in the tab); the result is returned to that
 *     caller, so where it goes next is decided by the caller, not by this file.
 *
 * What page data the function collects when called:
 *   - For each included element: ARIA role (explicit or inferred from the tag),
 *     an accessible name (aria-label, placeholder, title, alt, <label for>,
 *     button/link text, heading text, or short own text), a stable "ref_N" id,
 *     and the href / type / placeholder attributes.
 *   - <select> elements also list their <option> texts/values.
 *   - Form values are only included for non-sensitive inputs, and only if
 *     shorter than 50 characters. Password / hidden inputs and anything with a
 *     sensitive autocomplete hint (passwords, one-time codes, card numbers)
 *     are reported as "[value redacted]" (see isSensitiveField).
 *   - Page viewport size (width/height).
 *
 * Globals it creates on `window` (so refs stay stable across calls):
 *   __claudeElementMap          ref id -> WeakRef(element)
 *   __claudeElementReverseMap   WeakMap element -> ref id
 *   __claudeRefCounter          last ref number handed out
 */
(function () {
  window.__claudeElementMap || (window.__claudeElementMap = {}),
    window.__claudeElementReverseMap ||
      (window.__claudeElementReverseMap = new WeakMap()),
    window.__claudeRefCounter || (window.__claudeRefCounter = 0),
    /**
     * @param {string} [filter]    "interactive" = only clickable/typeable things;
     *                             "all" (default) = everything visible, plus hidden
     *                             elements are not skipped.
     * @param {number} [maxDepth]  how deep to walk (default 15)
     * @param {number} [maxChars]  truncate the output text to this many characters
     * @param {string} [refId]     only describe the subtree of this "ref_N" element
     * @returns {{pageContent: string, viewport: {width: number, height: number}, error?: string}}
     */
    (window.__generateAccessibilityTree = function (
      filter,
      maxDepth,
      maxChars,
      refId,
    ) {
      try {
        var outputLines = [],
          depthLimit = null != maxDepth ? maxDepth : 15;

        // ---------------------------------------------------------------------
        // Roles
        // ---------------------------------------------------------------------

        /** Explicit role attribute, otherwise a guess from the tag name. */
        function getRole(element) {
          var explicitRole = element.getAttribute("role");
          if (explicitRole) return explicitRole;
          var tagName = element.tagName.toLowerCase(),
            inputType = element.getAttribute("type");
          return (
            {
              a: "link",
              button: "button",
              input:
                "submit" === inputType || "button" === inputType
                  ? "button"
                  : "checkbox" === inputType
                    ? "checkbox"
                    : "radio" === inputType
                      ? "radio"
                      : "file" === inputType
                        ? "button"
                        : "textbox",
              select: "combobox",
              textarea: "textbox",
              h1: "heading",
              h2: "heading",
              h3: "heading",
              h4: "heading",
              h5: "heading",
              h6: "heading",
              img: "image",
              nav: "navigation",
              main: "main",
              header: "banner",
              footer: "contentinfo",
              section: "region",
              article: "article",
              aside: "complementary",
              form: "form",
              table: "table",
              ul: "list",
              ol: "list",
              li: "listitem",
              label: "label",
            }[tagName] || "generic"
          );
        }

        // ---------------------------------------------------------------------
        // Privacy: fields whose values must never be reported
        // ---------------------------------------------------------------------

        /** True for password/hidden inputs and inputs with a sensitive autocomplete hint. */
        function isSensitiveField(element) {
          var type = (element.getAttribute("type") || "").toLowerCase();
          if ("password" === type || "hidden" === type) return true;
          for (
            var autocomplete = (
                element.getAttribute("autocomplete") || ""
              ).toLowerCase(),
              sensitiveAutocompleteValues = [
                "current-password",
                "new-password",
                "one-time-code",
                "cc-number",
                "cc-csc",
                "cc-exp",
                "cc-exp-month",
                "cc-exp-year",
              ],
              index = 0;
            index < sensitiveAutocompleteValues.length;
            index++
          )
            if (autocomplete.indexOf(sensitiveAutocompleteValues[index]) !== -1)
              return true;
          return false;
        }

        // ---------------------------------------------------------------------
        // Accessible names
        // ---------------------------------------------------------------------

        /** Concatenated text of the element's direct text-node children (not descendants). */
        function getOwnText(element) {
          for (
            var text = "", index = 0;
            index < element.childNodes.length;
            index++
          )
            element.childNodes[index].nodeType === Node.TEXT_NODE &&
              (text += element.childNodes[index].textContent);
          return text.trim();
        }

        /** Best-effort human-readable label for an element ("" if none). */
        function getLabel(element) {
          var tagName = element.tagName.toLowerCase();
          if ("select" === tagName) {
            if (isSensitiveField(element)) {
              var ariaLabelSensitive = element.getAttribute("aria-label");
              if (ariaLabelSensitive && ariaLabelSensitive.trim())
                return ariaLabelSensitive.trim();
              var titleSensitive = element.getAttribute("title");
              if (titleSensitive && titleSensitive.trim())
                return titleSensitive.trim();
              if (element.id) {
                var labelForSensitive = document.querySelector(
                  'label[for="' + element.id + '"]',
                );
                if (labelForSensitive) {
                  var labelTextSensitive = getOwnText(labelForSensitive);
                  if (labelTextSensitive) return labelTextSensitive;
                }
              }
              return "[value redacted]";
            }
            var selectElement = element,
              selectedOption =
                selectElement.querySelector("option[selected]") ||
                selectElement.options[selectElement.selectedIndex];
            if (selectedOption && selectedOption.textContent)
              return selectedOption.textContent.trim();
          }
          var ariaLabel = element.getAttribute("aria-label");
          if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();
          var placeholder = element.getAttribute("placeholder");
          if (placeholder && placeholder.trim()) return placeholder.trim();
          var title = element.getAttribute("title");
          if (title && title.trim()) return title.trim();
          var alt = element.getAttribute("alt");
          if (alt && alt.trim()) return alt.trim();
          if (element.id) {
            var labelFor = document.querySelector(
              'label[for="' + element.id + '"]',
            );
            if (labelFor) {
              var labelText = getOwnText(labelFor);
              if (labelText) return labelText;
            }
          }
          if ("input" === tagName) {
            var inputElement = element,
              inputType = element.getAttribute("type") || "",
              valueAttribute = element.getAttribute("value");
            if ("submit" === inputType && valueAttribute && valueAttribute.trim())
              return valueAttribute.trim();
            if (isSensitiveField(element))
              return inputElement.value ? "[value redacted]" : "";
            if (
              inputElement.value &&
              inputElement.value.length < 50 &&
              inputElement.value.trim()
            )
              return inputElement.value.trim();
          }
          if ("textarea" === tagName && isSensitiveField(element))
            return element.value ? "[value redacted]" : "";
          if (["button", "a", "summary"].includes(tagName)) {
            for (
              var buttonText = "", childIndex = 0;
              childIndex < element.childNodes.length;
              childIndex++
            ) {
              var childNode = element.childNodes[childIndex];
              childNode.nodeType === Node.TEXT_NODE &&
                (buttonText += childNode.textContent);
            }
            if (buttonText.trim()) return buttonText.trim();
          }
          if (tagName.match(/^h[1-6]$/)) {
            var headingText = element.textContent;
            if (headingText && headingText.trim())
              return headingText.trim().substring(0, 100);
          }
          if ("img" === tagName) return "";
          for (
            var ownText = "", nodeIndex = 0;
            nodeIndex < element.childNodes.length;
            nodeIndex++
          ) {
            var node = element.childNodes[nodeIndex];
            node.nodeType === Node.TEXT_NODE && (ownText += node.textContent);
          }
          if (ownText && ownText.trim() && ownText.trim().length >= 3) {
            var trimmedText = ownText.trim();
            return trimmedText.length > 100
              ? trimmedText.substring(0, 100) + "..."
              : trimmedText;
          }
          return "";
        }

        // ---------------------------------------------------------------------
        // Classification helpers
        // ---------------------------------------------------------------------

        /** Rendered and not display:none / visibility:hidden / opacity:0 / zero-sized. */
        function isVisible(element) {
          var style = window.getComputedStyle(element);
          return (
            "none" !== style.display &&
            "hidden" !== style.visibility &&
            "0" !== style.opacity &&
            element.offsetWidth > 0 &&
            element.offsetHeight > 0
          );
        }

        /** Something a user can click, focus or type into. */
        function isInteractive(element) {
          var tagName = element.tagName.toLowerCase();
          return (
            [
              "a",
              "button",
              "input",
              "select",
              "textarea",
              "details",
              "summary",
            ].includes(tagName) ||
            null !== element.getAttribute("onclick") ||
            null !== element.getAttribute("tabindex") ||
            "button" === element.getAttribute("role") ||
            "link" === element.getAttribute("role") ||
            "true" === element.getAttribute("contenteditable")
          );
        }

        /** Structural/landmark elements (headings, nav, main, ... or anything with a role). */
        function isLandmark(element) {
          var tagName = element.tagName.toLowerCase();
          return (
            [
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "nav",
              "main",
              "header",
              "footer",
              "section",
              "article",
              "aside",
            ].includes(tagName) || null !== element.getAttribute("role")
          );
        }

        /** Decides whether an element gets its own line in the output. */
        function shouldInclude(element, options) {
          var tagName = element.tagName.toLowerCase();
          if (
            ["script", "style", "meta", "link", "title", "noscript"].includes(
              tagName,
            )
          )
            return false;
          if (
            "all" !== options.filter &&
            "true" === element.getAttribute("aria-hidden")
          )
            return false;
          if ("all" !== options.filter && !isVisible(element)) return false;
          if ("all" !== options.filter && !options.refId) {
            // Unless a specific ref was requested, skip elements outside the viewport.
            var rect = element.getBoundingClientRect();
            if (
              !(
                rect.top < window.innerHeight &&
                rect.bottom > 0 &&
                rect.left < window.innerWidth &&
                rect.right > 0
              )
            )
              return false;
          }
          if ("interactive" === options.filter) return isInteractive(element);
          if (isInteractive(element)) return true;
          if (isLandmark(element)) return true;
          if (getLabel(element).length > 0) return true;
          var role = getRole(element);
          return null !== role && "generic" !== role && "image" !== role;
        }

        // ---------------------------------------------------------------------
        // Tree walk
        // ---------------------------------------------------------------------

        var MAX_ELEMENTS = 1e4,
          emittedElementCount = 0;

        /** Appends this element (if included) and then its children to outputLines. */
        function walk(element, depth, options) {
          if (
            !(emittedElementCount >= MAX_ELEMENTS) &&
            !(depth > depthLimit) &&
            element &&
            element.tagName
          ) {
            var included =
              shouldInclude(element, options) ||
              (null !== options.refId && 0 === depth);
            if (included) {
              var role = getRole(element),
                label = getLabel(element),
                refKey = window.__claudeElementReverseMap.get(element) || null;
              if (refKey) {
                // Drop stale ref ids whose WeakRef no longer points at this element.
                var existingRef = window.__claudeElementMap[refKey];
                (existingRef && existingRef.deref() === element) ||
                  (refKey = null);
              }
              refKey ||
                ((refKey = "ref_" + ++window.__claudeRefCounter),
                (window.__claudeElementMap[refKey] = new WeakRef(element)),
                window.__claudeElementReverseMap.set(element, refKey)),
                emittedElementCount++;
              var line = " ".repeat(depth) + role;
              if (
                (label &&
                  (line +=
                    ' "' +
                    (label = label.replace(/\s+/g, " ").substring(0, 100)).replace(
                      /"/g,
                      '\\"',
                    ) +
                    '"'),
                (line += " [" + refKey + "]"),
                element.getAttribute("href") &&
                  (line += ' href="' + element.getAttribute("href") + '"'),
                element.getAttribute("type") &&
                  (line += ' type="' + element.getAttribute("type") + '"'),
                element.getAttribute("placeholder") &&
                  (line +=
                    ' placeholder="' +
                    element.getAttribute("placeholder") +
                    '"'),
                outputLines.push(line),
                "select" === element.tagName.toLowerCase() &&
                  !isSensitiveField(element))
              )
                for (
                  var selectOptions = element.options, optionIndex = 0;
                  optionIndex < selectOptions.length;
                  optionIndex++
                ) {
                  var option = selectOptions[optionIndex],
                    optionLine = " ".repeat(depth + 1) + "option",
                    optionText = option.textContent
                      ? option.textContent.trim()
                      : "";
                  optionText &&
                    (optionLine +=
                      ' "' +
                      (optionText = optionText
                        .replace(/\s+/g, " ")
                        .substring(0, 100)).replace(/"/g, '\\"') +
                      '"'),
                    option.selected && (optionLine += " (selected)"),
                    option.value &&
                      option.value !== optionText &&
                      (optionLine +=
                        ' value="' + option.value.replace(/"/g, '\\"') + '"'),
                    outputLines.push(optionLine);
                }
            }
            if (
              ("select" !== element.tagName.toLowerCase() ||
                !isSensitiveField(element)) &&
              element.children &&
              depth < depthLimit
            )
              for (
                var childIndex = 0;
                childIndex < element.children.length;
                childIndex++
              )
                walk(element.children[childIndex], included ? depth + 1 : depth, options);
          }
        }

        // ---------------------------------------------------------------------
        // Entry point
        // ---------------------------------------------------------------------

        var walkOptions = { filter: filter || "all", refId: refId };
        if (refId) {
          var rootRef = window.__claudeElementMap[refId];
          if (!rootRef)
            return {
              error:
                "Element with ref_id '" +
                refId +
                "' not found. It may have been removed from the page. Use read_page without ref_id to get the current page state.",
              pageContent: "",
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
              },
            };
          var rootElement = rootRef.deref();
          if (!rootElement)
            return {
              error:
                "Element with ref_id '" +
                refId +
                "' no longer exists. It may have been removed from the page. Use read_page without ref_id to get the current page state.",
              pageContent: "",
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
              },
            };
          walk(rootElement, 0, walkOptions);
        } else document.body && walk(document.body, 0, walkOptions);

        // Garbage-collect refs whose elements have been freed.
        for (var key in window.__claudeElementMap)
          window.__claudeElementMap[key].deref() ||
            delete window.__claudeElementMap[key];

        var pageContent = outputLines.join("\n");
        if (
          (emittedElementCount >= MAX_ELEMENTS &&
            (pageContent +=
              "\n[truncated at 10000 elements — page is very large; " +
              (refId
                ? "use a smaller depth or focus on a more specific child element"
                : "use a refId or smaller depth to focus") +
              "]"),
          null != maxChars && pageContent.length > maxChars)
        ) {
          var fullLength = pageContent.length,
            cutIndex = pageContent.lastIndexOf("\n", maxChars);
          cutIndex <= 0 && (cutIndex = Math.max(0, maxChars));
          var hint = refId
            ? "use a smaller depth or focus on a more specific child element"
            : "use ref_id or a smaller depth to focus";
          pageContent =
            pageContent.slice(0, cutIndex) +
            "\n[output truncated at " +
            maxChars +
            " of " +
            fullLength +
            " characters. Pass a larger max_chars (default 50000) to see more, or " +
            hint +
            ".]";
        }
        return {
          pageContent: pageContent,
          viewport: { width: window.innerWidth, height: window.innerHeight },
        };
      } catch (error) {
        throw new Error(
          "Error generating accessibility tree: " +
            (error.message || "Unknown error"),
        );
      }
    });
})();
