export const updateRejectMinutesAgenda = (
  minutesData,
  updateData,
  parentMinuteID,
  deleteCommentLocal
) => {
  return minutesData.map((agenda) => {
    // Update main minuteData
    const updatedMinuteData = agenda.minuteData.map((minute) => {
      if (minute.minuteID === parentMinuteID.minuteID) {
        const updatedDeclinedReviews = minute.declinedReviews.filter(
          (review) => {
            return !(
              (review.fK_WorkFlowActor_ID === 0 &&
                review.reason === updateData.reason) ||
              (review.fK_WorkFlowActor_ID ===
                deleteCommentLocal.fK_WorkFlowActor_ID &&
                review.reason === deleteCommentLocal.reason)
            );
          }
        );

        return {
          ...minute,
          reason: "",
          actorBundleStatusID: 2,
          declinedReviews: updatedDeclinedReviews,
        };
      }
      return minute;
    });

    // Update subMinutes if they exist
    const updatedSubMinutes = agenda.subMinutes?.map((subAgenda) => {
      const updatedSubMinuteData = subAgenda.minuteData.map((subMinute) => {
        if (subMinute.minuteID === parentMinuteID.minuteID) {
          const updatedDeclinedReviews = subMinute.declinedReviews.filter(
            (review) => {
              return !(
                (review.fK_WorkFlowActor_ID === 0 &&
                  review.reason === updateData.reason) ||
                (review.fK_WorkFlowActor_ID ===
                  deleteCommentLocal.fK_WorkFlowActor_ID &&
                  review.reason === deleteCommentLocal.reason)
              );
            }
          );

          return {
            ...subMinute,
            reason: "",
            actorBundleStatusID: 2,
            declinedReviews: updatedDeclinedReviews,
          };
        }
        return subMinute;
      });
      return { ...subAgenda, minuteData: updatedSubMinuteData };
    });

    return {
      ...agenda,
      minuteData: updatedMinuteData,
      subMinutes: updatedSubMinutes,
    };
  });
};

export const updateCommentMinutesGeneral = (
  minutesData,
  updateData,
  parentMinuteID,
  deleteCommentLocal
) => {
  return minutesData.map((minute) => {
    if (minute.minuteID === parentMinuteID.minuteID) {
      const updatedDeclinedReviews = minute.declinedReviews.filter((review) => {
        return !(
          (review.fK_WorkFlowActor_ID === 0 &&
            review.reason === updateData.reason) ||
          (review.fK_WorkFlowActor_ID ===
            deleteCommentLocal.fK_WorkFlowActor_ID &&
            review.reason === deleteCommentLocal.reason)
        );
      });

      return {
        ...minute,
        reason: "",
        actorBundleStatusID: 2,
        declinedReviews: updatedDeclinedReviews,
      };
    }
    return minute;
  });
};
