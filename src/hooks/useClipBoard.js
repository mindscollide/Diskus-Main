import clipboardCopy from "clipboard-copy";

// Reusable pure function to copy text to clipboard
const copyToClipboard = async (text) => {
  try {
    if (text) {
      await clipboardCopy(text);
    }
  } catch (error) {
    console.error("Copy to clipboard failed:", error);
  }
};

export default copyToClipboard;
