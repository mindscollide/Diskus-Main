// The Quill toolbars show a font ("Impact") and a size ("16px") as selected, but that
// is only the picker label: nothing is applied to the text, and clicking the already
// "selected" item does nothing (Quill ignores a re-click on the selected picker
// item). So what the user types came out in the editor's plain default and the
// toolbar looked wrong until text was selected and formatted by hand.
//
// attachDefaultEditorFormats makes the displayed default real, the way a word
// processor does:
//  - when an EMPTY editor receives its first text (typed or pasted) that text gets the
//    font and size to use. At first that is the default (Impact, 16px); afterwards it
//    is whatever the user used last, so choosing another font and then deleting
//    everything does not send the next word back to the default;
//  - only the attributes the text does not already carry are filled in: a font or size
//    chosen before typing, or brought by a paste, is kept, and so are pending bold /
//    italic / colour.
import { useCallback, useRef } from "react";

export const DEFAULT_EDITOR_FONT = "impact";
export const DEFAULT_EDITOR_SIZE = "16px";

// Returns a function that removes the listeners.
export const attachDefaultEditorFormats = (
  quill,
  { font = DEFAULT_EDITOR_FONT, size = DEFAULT_EDITOR_SIZE } = {},
) => {
  if (!quill) return () => {};

  // font / size to give the next text typed into an empty editor
  const toUse = {};
  if (font) toUse.font = font;
  if (size) toUse.size = size;

  // remember what the user is currently typing with
  const rememberFormat = () => {
    if (quill.getLength() <= 1 || !quill.getSelection()) return;
    const current = quill.getFormat();
    if (font && current.font) toUse.font = current.font;
    if (size && current.size) toUse.size = current.size;
  };

  const onTextChange = (delta, oldDelta, source) => {
    if (source !== "user") return;

    // not the first text of an empty editor: just remember the format in use
    if (oldDelta.length() > 1) {
      rememberFormat();
      return;
    }
    if (quill.getLength() <= 1) return;

    const missing = {};
    ["font", "size"].forEach((attribute) => {
      const wanted = attribute === "font" ? font : size;
      if (!wanted) return;
      const carried = delta.ops.some(
        (op) => op.attributes && op.attributes[attribute],
      );
      if (!carried) missing[attribute] = toUse[attribute];
    });
    if (Object.keys(missing).length > 0) {
      const selection = quill.getSelection();
      // "api" (not silent) so the editor's onChange runs and the saved HTML has them
      quill.formatText(0, quill.getLength() - 1, missing, "api");
      if (selection) {
        quill.setSelection(selection.index, selection.length, "silent");
      }
    }
    rememberFormat();
  };

  quill.on("text-change", onTextChange);
  quill.on("selection-change", rememberFormat);
  return () => {
    quill.off("text-change", onTextChange);
    quill.off("selection-change", rememberFormat);
  };
};

// React hook for ReactQuill: returns a callback ref to pass as <ReactQuill ref={...}>.
// It keeps editorRef.current pointing at the ReactQuill instance and attaches the
// defaults above whenever the editor is created (also inside modals, which render the
// editor after the parent mounts, so a mount-time effect would find the ref empty).
export const useDefaultEditorFormats = (editorRef, options) => {
  const detach = useRef(null);
  const optionsRef = useRef(options);
  return useCallback(
    (instance) => {
      detach.current?.();
      detach.current = null;
      if (editorRef) editorRef.current = instance;
      if (instance) {
        detach.current = attachDefaultEditorFormats(
          instance.getEditor(),
          optionsRef.current,
        );
      }
    },
    [editorRef],
  );
};
