/**
 * The "Reminder" options of a resolution. Create (ScheduleNewResolution) and Edit
 * (EditResolution) must offer exactly the same list: the number is what the server
 * stores, so a list that differs between the two screens shows the wrong label for a
 * saved reminder (Edit had an extra duplicate "1 day before" and "7 days before" as 7
 * while Create sends 6).
 *
 * @param {(key: string) => string} t translation function (react-i18next)
 * @returns {{label: string, value: number}[]}
 */
export const getResolutionReminderOptions = (t) => [
  { label: t("10-minutes-before"), value: 1 },
  { label: t("30-minutes-before"), value: 2 },
  { label: t("1-hour-before"), value: 3 },
  { label: t("5-hours-before"), value: 4 },
  { label: t("1-day-before"), value: 5 },
  { label: t("7-days-before"), value: 6 },
];
