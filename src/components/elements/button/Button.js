import React from "react";
import Button from "react-bootstrap/Button";

/**
 * @component CustomButton
 * @description A reusable wrapper around the react-bootstrap Button that supports
 * dual icons, a central text label, a raw value slot, and tutorial anchoring via
 * the `data-tut` attribute. Designed to be the standard button across the Diskus
 * platform so that styling and behaviour are kept consistent.
 *
 * @param {string}    text           - Label text rendered inside the button.
 * @param {ReactNode} icon           - Primary icon rendered before the text (wrapped in `iconClass` span).
 * @param {ReactNode} icon2          - Secondary icon rendered after the text (wrapped in `iconClass2` span).
 * @param {ReactNode} buttonValue    - Raw content rendered before all icon/text spans (e.g. a badge).
 * @param {Function}  onClick        - Click event handler.
 * @param {Function}  onChange       - Change event handler (useful when button doubles as a label trigger).
 * @param {string}    className      - Additional CSS class applied to the button element.
 * @param {boolean}   disableBtn     - When true the button is rendered in a disabled state.
 * @param {string}    variant        - Bootstrap variant (e.g. "primary", "secondary", "outline-primary").
 * @param {string}    size           - Bootstrap size ("sm" | "lg").
 * @param {string}    color          - Colour override passed directly to the bootstrap Button.
 * @param {string}    align          - Alignment attribute forwarded to the button.
 * @param {string}    type           - HTML button type ("button" | "submit" | "reset").
 * @param {object}    style          - Inline style object applied to the button.
 * @param {string}    datatut        - Value for the `data-tut` attribute used by onboarding tour libraries.
 * @param {string}    title          - Native tooltip text shown on hover.
 * @param {string}    pdfIcon        - Reserved prop for a PDF-specific icon (currently unused in JSX).
 * @param {string}    pdfIconClass   - CSS class for the PDF icon wrapper (currently unused in JSX).
 * @param {string}    iconClass      - CSS class for the primary icon wrapper span.
 * @param {string}    iconClass2     - CSS class for the secondary icon wrapper span.
 * @param {string}    textClass      - CSS class for the text wrapper span.
 *
 * @example
 * <CustomButton
 *   text="Save"
 *   variant="primary"
 *   onClick={handleSave}
 *   disableBtn={isSubmitting}
 * />
 */
const CustomButton = ({
  text,
  icon,
  onClick,
  className,
  icon2,
  disableBtn,
  variant,
  datatut,
  size,
  color,
  align,
  type,
  onChange,
  style,
  pdfIcon,
  pdfIconClass,
  iconClass,
  iconClass2,
  textClass,
  buttonValue,
  title
}) => {
  return (
    <>
      <Button
        type={type}
        color={color}
        size={size}
        className={className}
        variant={variant}
        disabled={disableBtn}
        onClick={onClick}
        onChange={onChange}
        align={align}
        data-tut={datatut}
        style={style}
        title={title}
      >
        {buttonValue}
        <span className={iconClass}>{icon}</span>
        <span className={textClass}>{text}</span>
        <span className={iconClass2}>{icon2}</span>
      </Button>
    </>
  );
};

export default CustomButton;
