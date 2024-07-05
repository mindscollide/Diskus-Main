let Data = {
  agendaWiseMinutes: [
    {
      minuteID: 148,
      agendaID: 3758,
      agendaTitle: "Agenda 1 For Minute",
      minutesDetails:
        '<p>This is the first minute for parent agenda named "Agenda 1 For Minute"</p>',
      userID: 1220,
      userName: "Owais Premium",
      lastUpdatedDate: "20240628",
      lastUpdatedTime: "072111",
      userProfilePicture: {
        userID: 1220,
        orignalProfilePictureName: "20240603085008728.PNG",
        displayProfilePictureName: "",
      },
      minutesAttachmets: [],
    },
    {
      minuteID: 149,
      agendaID: 3759,
      agendaTitle: "Sub Agenda 1 For Minute",
      minutesDetails:
        "<p>This is the MInute for Sub Agenda 1 of Parent Agenda</p>",
      userID: 1220,
      userName: "Owais Premium",
      lastUpdatedDate: "20240628",
      lastUpdatedTime: "072154",
      userProfilePicture: {
        userID: 1220,
        orignalProfilePictureName: "20240603085008728.PNG",
        displayProfilePictureName: "",
      },
      minutesAttachmets: [],
    },
  ],
  agendaHierarchyList: [
    {
      pK_MAID: 3758,
      title: "Agenda 1 For Minute",
      childAgendas: [
        {
          pK_MAID: 3759,
          parentID: 3758,
          title: "Sub Agenda 1 For Minute",
        },
        {
          pK_MAID: 3760,
          parentID: 3758,
          title: "Sub AGenda 2 For Minute",
        },
      ],
    },
    {
      pK_MAID: 3761,
      title: "Agenda 2",
      childAgendas: [],
    },
  ],
};

export const newData = () => {
  let getMinutesIds = Data.agendaWiseMinutes.map((data2, index) => {
    let newList = Data.agendaHierarchyList.forEach(
      (data2, index) => data2.pK_MAID === data2.agendaID
    );
    console.log(newList, "newListnewListnewList")
  });
  console.log(getMinutesIds, "getMinutesIdsgetMinutesIdsgetMinutesIds");
 
};
