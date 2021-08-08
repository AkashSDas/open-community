/// Resize textarea height dynamically
///
/// NOTE: If you've a case where your textarea is mounting & unmounting
/// but not your main component where you've defined this hook then extract
/// textarea into separate hook and that way you can use the lifecycle
/// events (mounting and unmounting) of the textarea and not the top component
/// where this hook is defined. If you don't do this then textare if
/// having default `value` will have height that'll fit the content but as
/// the textarea is unmounted (not the top component where this hook is defined)
/// and then mounted again, now the height will be default textarea height and
/// this might not fit your content and then you've to scroll.

import { useEffect, useRef } from "react";

/// Similar situation was faced in `editor-mode-0` in post_form.tsx
export function useResizeTextareaHeight(
  value: string,
  solveScrollIssue?: boolean
) {
  const ref = useRef(null);

  // Whenever the value updates the height will update
  useEffect(() => {
    ref.current.style.height = "0px";
    const scrollHeight = ref.current.scrollHeight;
    ref.current.style.height = scrollHeight + "px";

    // this solves the issue of jumps when the height changes
    // so the problem is when you enter value in between then
    // the textarea will scroll and cursor (where you want to
    // enter something will be at bottom of the screen). To
    // solve those jump issues below code is used which keep the
    // cursor position intact even if the height of textarea is
    // changing. There is no change in position as we scroll the
    // window and default scroll is in opposite direction so
    // both of them cancel each other
    //
    // this is the solution of ContentEditor textareas where
    // content is edited, to avoid jumps while writing this
    // solution is used
    //
    // Since this issue needed to be solved for one specific case
    // i.e. ContentEditor, therefore solveScrollIssue param is used
    //
    // Stackoverflow post: https://stackoverflow.com/a/24958072
    if (solveScrollIssue && typeof window !== "undefined") {
      window.scrollTo(
        ref.current.scrollLeft,
        ref.current.scrollTop + ref.current.scrollHeight
      );
    }
  }, [value]);

  return { ref };
}
