import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/elements";
import { resolutionResultTable } from "../../../commen/functions/date_formater";

// "Vote" column cell shared by the polls tables (Polling, Group, Committee).
//  - Published + voter: "Vote" / "Voted" button while the poll is open (and `canVote`),
//    otherwise "View votes".
//  - Expired + voter + poll was published: "View votes".
//  - Expired + not a voter: "View votes" only when `viewVotesForNonVoters`.
const PollVoteCell = ({
  record,
  canVote = true,
  viewVotesForNonVoters = false,
  voteClassName,
  viewVotesClassName,
  onVote,
  onViewVotes,
}) => {
  const { t } = useTranslation();
  const statusId = record.pollStatus.pollStatusId;

  const viewVotesButton = (
    <Button
      className={viewVotesClassName}
      text={t("View-votes")}
      onClick={() => onViewVotes(record)}
    />
  );

  if (statusId === 2) {
    if (!record.isVoter) return null;
    const isOpen = new Date() < resolutionResultTable(record.dueDate);
    if (isOpen && canVote) {
      return (
        <Button
          className={voteClassName}
          text={record.voteStatus === "Not Voted" ? t("Vote") : t("Voted")}
          onClick={() => onVote(record)}
        />
      );
    }
    return viewVotesButton;
  }

  if (statusId === 3) {
    if (record.isVoter) return record.wasPollPublished ? viewVotesButton : null;
    return viewVotesForNonVoters ? viewVotesButton : null;
  }

  return null;
};

export default PollVoteCell;
