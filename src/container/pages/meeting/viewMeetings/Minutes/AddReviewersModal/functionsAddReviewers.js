export const handleCheck = (
  checked,
  ID,
  flag,
  minuteDataAgenda,
  minuteDataGeneral,
  selectedMinuteIDs,
  setSelectedMinuteIDs
) => {
  if (flag === "ParentCheckboxAgenda") {
    if (checked) {
      // Add all minute IDs from minuteData for the given agendaID to selectedMinuteIDs
      const agenda = minuteDataAgenda.find((item) => item.agendaID === ID);

      if (agenda) {
        const allMinuteIDs = agenda.minuteData.map((item) => item.minuteID);
        setSelectedMinuteIDs([...selectedMinuteIDs, ...allMinuteIDs]);
      }
    } else {
      // Remove all minute IDs from minuteData for the given agendaID from selectedMinuteIDs
      const agenda = minuteDataAgenda.find((item) => item.agendaID === ID);

      if (agenda) {
        const filteredIDs = selectedMinuteIDs.filter(
          (id) => !agenda.minuteData.some((item) => item.minuteID === id)
        );
        setSelectedMinuteIDs(filteredIDs);
      }
    }
  } else if (flag === "ParentMinuteCheckbox") {
    if (checked) {
      setSelectedMinuteIDs([...selectedMinuteIDs, ID]);
    } else {
      setSelectedMinuteIDs(selectedMinuteIDs.filter((id) => id !== ID));
    }
  } else if (flag === "SubAgendaTitleCheckbox") {
    // Flatten all subMinutes across all agendas
    const allSubMinutes = minuteDataAgenda.flatMap(
      (agenda) => agenda.subMinutes
    );

    // Find the specific sub-agenda using the subAgendaID
    const targetSubAgenda = allSubMinutes.find((item) => item.agendaID === ID);

    if (targetSubAgenda) {
      const subAgendaMinuteIDs = targetSubAgenda.minuteData.map(
        (minute) => minute.minuteID
      );

      if (checked) {
        // Add only the minute IDs from sub-agenda minuteData to selectedMinuteIDs
        setSelectedMinuteIDs((prevSelected) => [
          ...prevSelected,
          ...subAgendaMinuteIDs.filter((id) => !prevSelected.includes(id)),
        ]);
      } else {
        // Remove only the minute IDs from sub-agenda minuteData from selectedMinuteIDs
        setSelectedMinuteIDs((prevSelected) =>
          prevSelected.filter((id) => !subAgendaMinuteIDs.includes(id))
        );
      }
    }
  } else if (flag === "SubAgendaMinuteCheckbox") {
    if (checked) {
      setSelectedMinuteIDs([...selectedMinuteIDs, ID]);
    } else {
      setSelectedMinuteIDs(selectedMinuteIDs.filter((id) => id !== ID));
    }
  } else if (flag === "GeneralTitleCheckbox") {
    try {
      if (checked) {
        // Add all minute IDs from minuteDataGeneral to selectedMinuteIDs
        const allMinuteIDs = minuteDataGeneral.map((item) => item.minuteID);
        setSelectedMinuteIDs([...selectedMinuteIDs, ...allMinuteIDs]);
      } else {
        // Remove all minute IDs from minuteDataGeneral from selectedMinuteIDs
        const filteredIDs = selectedMinuteIDs.filter(
          (id) => !minuteDataGeneral.some((item) => item.minuteID === id)
        );
        setSelectedMinuteIDs(filteredIDs);
      }
    } catch {}
  } else if (flag === "GeneralMinuteCheckbox") {
    try {
      if (checked) {
        setSelectedMinuteIDs([...selectedMinuteIDs, ID]);
      } else {
        setSelectedMinuteIDs(selectedMinuteIDs.filter((id) => id !== ID));
      }
    } catch {}
  }
};

export const findUserProfileImg = (userId, users) => {
  console.log("userId, users", userId, users);
  try {
    if (!Array.isArray(users)) {
      users = [users];
    }
    const user = users.find((user) => user.userID === userId);
    return user ? user.userProfileImg : "";
  } catch (error) {
    console.log("userId, users", error);
  }
};

export const checkReviewersListGeneral = (dataArray) => {
  try {
    console.log("DataArrayDataArray", dataArray);
    if (!Array.isArray(dataArray)) {
      dataArray = [dataArray];
    }
    // Use find method to check if any object has a non-empty reviewersList
    return (
      dataArray.find(
        (obj) => obj.reviewersList && obj.reviewersList.length > 0
      ) !== undefined
    );
  } catch {
    return false; // Returning false in case of an error
  }
};

export const checkReviewersListAgenda = (dataArray) => {
  console.log("DataArrayDataArray", dataArray);
  try {
    if (!Array.isArray(dataArray)) {
      dataArray = [dataArray];
    }
    // Use find method to check if any minuteData item has a non-empty reviewersList
    return (
      dataArray.find(
        (obj) =>
          obj.minuteData &&
          obj.minuteData.find(
            (minute) => minute.reviewersList && minute.reviewersList.length > 0
          ) !== undefined
      ) !== undefined
    );
  } catch {
    return false; // Returning false in case of an error
  }
};

export const filterDataByIDs = (data, stateMinuteIDs) => {
  return data.filter((item) => stateMinuteIDs.includes(item.minuteID));
};

export function filterMinutes(data, minuteIDs) {
  return data
    .map((agenda) => {
      const filteredMinuteData = agenda.minuteData.filter((minute) =>
        minuteIDs.includes(minute.minuteID)
      );

      const filteredSubMinutes = agenda.subMinutes
        .map((subAgenda) => {
          const filteredSubMinuteData = subAgenda.minuteData.filter((minute) =>
            minuteIDs.includes(minute.minuteID)
          );
          return {
            ...subAgenda,
            minuteData: filteredSubMinuteData,
          };
        })
        .filter((subAgenda) => subAgenda.minuteData.length > 0);

      return {
        ...agenda,
        minuteData: filteredMinuteData,
        subMinutes: filteredSubMinutes,
      };
    })
    .filter(
      (agenda) => agenda.minuteData.length > 0 || agenda.subMinutes.length > 0
    );
}

export function hasMinuteData(obj) {
  // Check if the parent object's minuteData array has a length greater than 0
  if (obj.minuteData.length > 0) {
    return true;
  }

  // Check if any subMinutes item has a minuteData array with a length greater than 0
  const hasSubMinutesData = obj.subMinutes.find(
    (subMinute) => subMinute.minuteData.length > 0
  );

  return !!hasSubMinutesData;
}

export function updateUsers(agenda, users) {
  // Helper function to process minuteData
  const processMinuteData = (minuteData) => {
    minuteData.find((minute) => {
      if (minute.reviewersList) {
        minute.reviewersList.find((reviewer) => {
          if (!users.includes(reviewer)) {
            users.push(reviewer);
          }
        });
      }
    });
  };

  // Process main minuteData
  processMinuteData(agenda.minuteData);

  // Process subMinutes
  agenda.subMinutes.find((subMinute) => {
    processMinuteData(subMinute.minuteData);
  });
}

export const matchDataByMinuteID = (item, stateMinuteIDs) => {
  return stateMinuteIDs.includes(item.minuteID);
};