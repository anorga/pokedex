import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to the top on forward navigation (PUSH/REPLACE), but leaves the
 * scroll position alone on back/forward (POP) so returning to a list restores
 * where the user was.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, navigationType]);

  return null;
}

export default ScrollToTop;
