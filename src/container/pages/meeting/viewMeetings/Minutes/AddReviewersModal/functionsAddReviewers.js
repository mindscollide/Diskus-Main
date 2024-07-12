import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";

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

export const updateMinutesData = (
  minuteDataAgenda,
  minuteDataGeneral,
  reviewersList,
  selectedMinuteIDs,
  setMinuteDataAgenda,
  setMinuteDataGeneral,
  setSelectedMinuteIDs,
  setSelectReviewersArray
) => {
  try {
    // Helper function to update minuteData with reviewersList based on isChecked value
    const updateMinuteData = (minuteData) => {
      return minuteData.map((minute) => {
        console.log("minuteDataAgenda", minute);
        console.log("minuteDataAgenda", selectedMinuteIDs);
        console.log(
          "minuteDataAgenda",
          matchDataByMinuteID(minute, selectedMinuteIDs)
        );
        if (matchDataByMinuteID(minute, selectedMinuteIDs)) {
          return {
            ...minute,
            reviewersList: reviewersList,
          };
        } else {
          return {
            ...minute,
          };
        }
      });
    };
    // Process the first state
    const updatedState1 = minuteDataAgenda.map((agenda) => {
      console.log("minuteDataAgenda", agenda);
      console.log("minuteDataAgenda", agenda.minuteData);
      // Update minuteData at the top level
      let updatedAgenda = {
        ...agenda,
        minuteData: updateMinuteData(agenda.minuteData),
      };

      // Update subMinutes if they exist
      if (agenda.subMinutes) {
        updatedAgenda.subMinutes = agenda.subMinutes.map((subAgenda) => ({
          ...subAgenda,
          minuteData: updateMinuteData(subAgenda.minuteData),
        }));
      }

      return updatedAgenda;
    });

    // Process the second state
    let filteredGeneralData = filterDataByIDs(
      minuteDataGeneral,
      selectedMinuteIDs
    );
    const updatedState2 = minuteDataGeneral.map((minute) => {
      if (filteredGeneralData.includes(minute)) {
        // Update reviewersList for filtered objects
        return {
          ...minute,
          reviewersList: reviewersList,
        };
      }
      // Return unchanged objects for non-filtered items
      return minute;
    });

    setMinuteDataAgenda(updatedState1);
    setMinuteDataGeneral(updatedState2);
    setSelectedMinuteIDs([]);
    setSelectReviewersArray([]);
  } catch (error) {
    console.error("Error updating minutes data:", error);
  }
};

export function hasNonEmptyReviewersAgenda(jsonData) {
  // Check if any minuteData has non-empty reviewersList
  const hasNonEmptyInMinutes = jsonData.find((item) =>
    item.minuteData.some((minute) => minute.reviewersList.length > 0)
  );

  // Check if any subMinutes' minuteData has non-empty reviewersList
  const hasNonEmptyInSubMinutes = jsonData.find(
    (item) =>
      item.subMinutes &&
      item.subMinutes.some((sub) =>
        sub.minuteData.some((minute) => minute.reviewersList.length > 0)
      )
  );

  // Return true if any reviewersList is non-empty, otherwise false
  return !!hasNonEmptyInMinutes || !!hasNonEmptyInSubMinutes;
}

export function allReviewersListsNonEmptyGeneral(data) {
  return !data.find((item) => item.reviewersList.length === 0);
}

export const checkReviewersListSubAgenda = (dataArray) => {
  console.log("DataArrayDataArray", dataArray);
  try {
    if (!Array.isArray(dataArray)) {
      dataArray = [dataArray];
    }
    // Use find method to check if any subMinutes item has a non-empty reviewersList in its minuteData
    return (
      dataArray.find(
        (obj) =>
          obj.subMinutes &&
          obj.subMinutes.find(
            (minute) =>
              minute.minuteData &&
              minute.minuteData.find(
                (subMinute) =>
                  subMinute.reviewersList && subMinute.reviewersList.length > 0
              ) !== undefined
          ) !== undefined
      ) !== undefined
    );
  } catch {
    return false; // Returning false in case of an error
  }
};

export function createListOfActionAbleBundle(
  minuteDataAgenda,
  minuteDataGeneral,
  minuteDate
) {
  let resultList = [];

  // Process minuteDataAgenda
  minuteDataAgenda.forEach((parentAgenda) => {
    console.log("createListOfActionAbleBundle", parentAgenda);
    // Check if the parent agenda is checked
    // if (parentAgenda.isChecked) {
    // Process minuteData within parent agenda
    parentAgenda.minuteData.forEach((minute) => {
      console.log("createListOfActionAbleBundle minute", minute);
      // Check if minute is checked
      if (minute.reviewersList.length > 0 && minute.apiCheck === false) {
        resultList.push({
          // ID: minute.minuteID.toString(),
          ID: "0",
          Title: "", // Set title as needed
          BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
          ListOfUsers: minute.reviewersList,
          Entity: {
            EntityID: minute.minuteID,
            EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
          },
        });
      } else if (minute.reviewersList.length > 0 && minute.apiCheck) {
        if (minute.isEdit) {
          resultList.push({
            // ID: minute.minuteID.toString(),
            ID: minute.bundleID !== "0" ? String(minute.bundleID) : "0",
            Title: "", // Set title as needed
            BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
            ListOfUsers: minute.reviewersList,
            Entity: {
              EntityID: minute.minuteID,
              EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
            },
          });
        }
      }
    });

    // Process subMinutes within parent agenda
    parentAgenda.subMinutes.forEach((subAgenda) => {
      console.log("createListOfActionAbleBundle subAgenda", subAgenda);
      // Check if sub agenda is checked
      subAgenda.minuteData.forEach((minute) => {
        console.log("createListOfActionAbleBundle minute", minute);
        // Check if minute is checked
        if (minute.reviewersList.length > 0 && minute.apiCheck === false) {
          resultList.push({
            // ID: minute.minuteID.toString(),
            ID: "0",
            Title: "", // Set title as needed
            BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
            ListOfUsers: minute.reviewersList,
            Entity: {
              EntityID: minute.minuteID,
              EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
            },
          });
        } else if (minute.reviewersList.length > 0 && minute.apiCheck) {
          if (minute.isEdit) {
            resultList.push({
              // ID: minute.minuteID.toString(),
              ID: minute.bundleID !== "0" ? String(minute.bundleID) : "0",
              Title: "", // Set title as needed
              BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
              ListOfUsers: minute.reviewersList,
              Entity: {
                EntityID: minute.minuteID,
                EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
              },
            });
          }
        }
      });
    });
    // }
  });

  // Process minuteDataGeneral
  minuteDataGeneral.forEach((minute) => {
    console.log("createListOfActionAbleBundle minute", minute);
    // Check if minute is checked
    if (minute.reviewersList.length > 0 && minute.apiCheck === false) {
      resultList.push({
        // ID: minute.minuteID.toString(),
        ID: "0",
        Title: "", // Set title as needed
        BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
        ListOfUsers: minute.reviewersList,
        Entity: {
          EntityID: minute.minuteID,
          EntityTypeID: 2, // Assuming EntityTypeID for minuteDataGeneral is 2
        },
      });
    } else if (minute.reviewersList.length > 0 && minute.apiCheck) {
      if (minute.isEdit) {
        resultList.push({
          // ID: minute.minuteID.toString(),
          ID: minute.bundleID !== "0" ? String(minute.bundleID) : "0",
          Title: "", // Set title as needed
          BundleDeadline: multiDatePickerDateChangIntoUTC(minuteDate), // Set bundle deadline as needed
          ListOfUsers: minute.reviewersList,
          Entity: {
            EntityID: minute.minuteID,
            EntityTypeID: 3, // Assuming EntityTypeID for minuteDataAgenda is 3
          },
        });
      }
    }
  });

  return resultList;
}

export function extractPKUIDsFromActors(obj) {
  return obj.actors.map((actor) => actor.pK_UID);
}
// Find matching entry in data state by pK_MeetingAgendaMinutesID
export function findEntityIndexByMinuteID(convertData, minuteID) {
  // Access the entities array within bundleModels
  let entities = convertData.bundleModels;

  // Find the index of the entity that matches the minuteID
  let index = entities.findIndex((bundle) => {
    return bundle.entities.some((entity) => entity.entityID === minuteID);
  });
  // Create an object to return the index and flag
  let result = {
    index: index,
    found: index !== -1, // true if index is found, false otherwise
  };

  return result;
}
