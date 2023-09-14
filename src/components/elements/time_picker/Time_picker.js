import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import "./Time_picker.css"
import { TimePicker, Typography } from "antd"
import moment from "moment"
import { ConfigProvider } from "antd"
import ar_EG from "antd/es/locale/ar_EG"
import en_US from "antd/es/locale/en_GB"
import fr_FR from "antd/es/locale/fr_FR"
require("moment/locale/ar")
require("moment/locale/fr")
require("moment/locale/en-gb")

const TimePickers = ({
  value,
  disable,
  placeholder,
  timeFormat,
  timeChangerHandler,
  size,
  change,
  name,
  onOpenChange,
  open,
}) => {
  const { Text } = Typography
  let currentLanguage = localStorage.getItem("i18nextLng")
  let TimeFormat = "HH:mm"
  function onChange(date, timeString) {
    console.log("time check", date, timeString)
    change({ target: { name: name, value: timeString } })
  }
  const disabledTime = (value) => {
    return value && value > moment().endOf("day")
  }
  // console.log("detailsHandler time", value);

  useEffect(() => {
    if (currentLanguage === "ar") {
      moment.locale(currentLanguage)
    } else if (currentLanguage === "fr") {
      moment.locale(currentLanguage)
    } else {
      moment.locale(currentLanguage)
    }
  }, [currentLanguage])
  return (
    <>
      <ConfigProvider
        locale={
          currentLanguage === "ar"
            ? ar_EG
            : currentLanguage === "fr"
            ? fr_FR
            : en_US
        }
      >
        <TimePicker
          className="timepicker_width"
          disabled={disable}
          format={TimeFormat}
          value={value ? moment(value, TimeFormat) : null}
          placeholder={placeholder}
          onChange={onChange}
          size={size}
        />
      </ConfigProvider>
    </>
  )
}

export default TimePickers
