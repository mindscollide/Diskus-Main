import React from "react";
import ar_EG from "antd/es/locale/ar_EG";
// Must be the `moment/dist/` (ESM) locale (see date_formater.js). `ar-sa` is the
// Arabic locale whose week starts on Sunday (`ar` starts on Saturday).
import "moment/dist/locale/ar-sa";

// antd (v4) prints the day number in calendar cells as a plain number, so in Arabic
// the days stay Latin while the month / year header is Arabic. `getDateRender()`
// returns a `dateRender` prop for antd DatePicker / RangePicker that prints the day
// with Arabic digits when the app language is Arabic, and `undefined` otherwise.
// It only needs `current.date()`, so it works with moment and dayjs values alike.
const arabicDigits = new Intl.NumberFormat("ar-EG", { useGrouping: false });

// `locale` prop for antd DatePicker / RangePicker: Arabic with the week starting on
// Sunday. Returns `undefined` for other languages so the app-level locale is used.
// It is passed per picker on purpose: changing the global moment `ar` locale would
// also change the week start of every other Arabic calendar in the app.
export const getPickerLocale = () => {
  if (localStorage.getItem("i18nextLng") !== "ar") return undefined;
  return { ...ar_EG.DatePicker, lang: { ...ar_EG.DatePicker.lang, locale: "ar-sa" } };
};

// `iconStyle` for react-multi-date-picker's <InputIcon>: the calendar icon sits on the
// right in English and on the left in Arabic (opposite to where the text starts).
export const getInputIconStyle = () =>
  localStorage.getItem("i18nextLng") === "ar"
    ? { left: "2.5px", right: "auto" }
    : { right: "2.5px", left: "auto" };

export const getDateRender = () => {
  if (localStorage.getItem("i18nextLng") !== "ar") return undefined;
  return (current) => (
    <div className="ant-picker-cell-inner">
      {arabicDigits.format(current.date())}
    </div>
  );
};
