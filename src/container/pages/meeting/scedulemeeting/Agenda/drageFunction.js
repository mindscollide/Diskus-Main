export const onDragEnd = (result,rows, setRows) => {
 // Dropped nowhere
 if (!result.destination) {
    return;
  }
  if (result.type === "PARENT") {
    const reorderedRows = [...rows];
    const [movedRow] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, movedRow);
    setRows(reorderedRows);
  } else if (result.type === "SUB_AGENDA") {
    const sourceParentIndex = parseInt(
      result.source.droppableId.split("-")[2]
    );
    const destinationParentIndex = parseInt(
      result.destination.droppableId.split("-")[2]
    );
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceParentIndex === destinationParentIndex) {
      // Reordering within the same parent
      const updatedParent = { ...rows[sourceParentIndex] };
      const [movedSubAgenda] = updatedParent.subAgenda.splice(sourceIndex, 1);
      updatedParent.subAgenda.splice(destinationIndex, 0, movedSubAgenda);
      const updatedRows = [...rows];
      updatedRows[sourceParentIndex] = updatedParent;
      setRows(updatedRows);
    } else {
      // Moving from one parent to another
      const sourceParent = { ...rows[sourceParentIndex] };
      const destinationParent = { ...rows[destinationParentIndex] };
      const [movedSubAgenda] = sourceParent.subAgenda.splice(sourceIndex, 1);
      destinationParent.subAgenda.splice(destinationIndex, 0, movedSubAgenda);
      const updatedRows = [...rows];
      updatedRows[sourceParentIndex] = sourceParent;
      updatedRows[destinationParentIndex] = destinationParent;
      setRows(updatedRows);
    }
  } else if (result.type === "attachment") {
    // Handle attachment drag-and-drop
    const sourceParentType = result.source.droppableId.split("-")[0];
    const destinationParentType =
      result.destination.droppableId.split("-")[0];
    if (sourceParentType === "parent" && destinationParentType === "parent") {
      const sourceParentIndex = parseInt(
        result.source.droppableId.split("-")[1]
      );
      const destinationParentIndex = parseInt(
        result.destination.droppableId.split("-")[1]
      );
      // Attachment is moved between different parent agendas
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      const sourceParent = { ...rows[sourceParentIndex] };
      const destinationParent = { ...rows[destinationParentIndex] };
      const movedAttachment = sourceParent.files.splice(sourceIndex, 1)[0];
      destinationParent.files.splice(destinationIndex, 0, movedAttachment);
      const updatedRows = [...rows];
      updatedRows[sourceParentIndex] = sourceParent;
      updatedRows[destinationParentIndex] = destinationParent;
      setRows(updatedRows);
    } else if (
      sourceParentType === "subAgendaID" &&
      destinationParentType === "parent"
    ) {
      const sourceIndex = result.source.droppableId;
      const parts = sourceIndex.split("-");
      const destination = result.destination.droppableId;
      const parentsDestination = destination.split("-");
      // Find the indices of "subAgendaID" and "parent" in the array
      const subAgenda = parts.indexOf("subAgendaID");
      const parentIndex = parts.indexOf("parent");
      const parentDestinationIndex = parentsDestination.indexOf("parent");
      // Fetch the values next to "subAgendaID" and "parent"
      const subAgendaID = parts[subAgenda + 1];
      const sourceParentID = parts[parentIndex + 1];
      const findSourcePrentIndex = rows.findIndex(
        (obj) => obj.ID === sourceParentID
      );
      const destinationParentID =
        parentsDestination[parentDestinationIndex + 1];
      const destinationParentIndex = rows.findIndex(
        (obj) => obj.ID === destinationParentID
      );
      const destinationIndex = result.destination.index;
      // Get the source parent and sub-agenda objects
      const sourceParent = { ...rows[findSourcePrentIndex] };
      const duplicatedObjectIndex = sourceParent.subAgenda.findIndex(
        (obj) => obj.SubAgendaID === subAgendaID
      );
      const sourceSubAgenda = sourceParent.subAgenda[duplicatedObjectIndex];

      // Remove the attachment from the source sub-agenda
      const movedAttachment = sourceSubAgenda.Subfiles.splice(
        result.source.index,
        1
      )[0];

      // Add the removed attachment to the destination parent's files array at the specified index
      const destinationParent = { ...rows[destinationParentIndex] };
      destinationParent.files.splice(destinationIndex, 0, movedAttachment);

      // Update the rows data with the modified parent and sub-agenda objects
      const updatedRows = [...rows];
      updatedRows[findSourcePrentIndex] = sourceParent;
      updatedRows[destinationParentIndex] = destinationParent;
      setRows(updatedRows);
    } else if (
      sourceParentType === "parent" &&
      destinationParentType === "subAgendaID"
    ) {
      // Attachment is moved from sub agenda to parent agenda
      const destination = result.destination.droppableId;
      const destinationParts = destination.split("-");
      // destination Parent ID Index in responce
      const destinationParentIDIndex = destinationParts.indexOf("parent");
      // destination Parent ID in responce
      const destinationParentID =
        destinationParts[destinationParentIDIndex + 1];
      // find index of parent in main json data
      const findDestinationParentIDIndex = rows.findIndex(
        (obj) => obj.ID === destinationParentID
      );

      const destinationParent = { ...rows[findDestinationParentIDIndex] };
      //  sub agend index in responce
      const destinationSubAgendaIDIndex =
        destinationParts.indexOf("subAgendaID");
      // sub Agenda ID in jason responce
      const destinationSubAgendaID =
        destinationParts[destinationSubAgendaIDIndex + 1];
      // find sub Agenda of that parent index
      const findDestinationSubAgendaIDIndex =
        destinationParent.subAgenda.findIndex(
          (obj) => obj.SubAgendaID === destinationSubAgendaID
        );
      const source = result.source.droppableId;
      const sourceParts = source.split("-");
      // source parent ID index from responce
      const parentSourceIndex = sourceParts.indexOf("parent");
      // source parent ID  from responce
      const ParentSourcID = sourceParts[parentSourceIndex + 1];
      // find parent index from main json
      const findSourceParentIDIndex = rows.findIndex(
        (obj) => obj.ID === ParentSourcID
      );

      // Find the source and destination parent agendas and sub-agendas
      const sourceParent = { ...rows[findSourceParentIDIndex] };
      const destinationSubAgenda =
        destinationParent.subAgenda[findDestinationSubAgendaIDIndex];
      // Find the attachment to be moved from the source parent's files
      const movedAttachment = sourceParent.files.splice(
        result.source.index,
        1
      )[0];

      // Add the removed attachment to the destination sub-agenda's Subfiles array
      destinationSubAgenda.Subfiles.splice(
        result.destination.index,
        0,
        movedAttachment
      );

      // Update the rows data with the modified source and destination parent agendas
      const updatedRows = [...rows];
      updatedRows[findSourceParentIDIndex] = sourceParent;
      updatedRows[findDestinationParentIDIndex] = destinationParent;
      setRows(updatedRows);
    } else if (
      sourceParentType === "subAgendaID" &&
      destinationParentType === "subAgendaID"
    ) {
      // Attachment is moved between different sub-agendas
      // for source
      const sourceIndex = result.source.droppableId;
      const sourceParts = sourceIndex.split("-");
      // Find the indices of "subAgendaID" and "parent" in the array
      const sourceSubAgendaIndex = sourceParts.indexOf("subAgendaID");
      const sourceParentAgendaIndex = sourceParts.indexOf("parent");
      // Fetch the values next to "subAgendaID" and "parent"
      const sourceSubAgendaID = sourceParts[sourceSubAgendaIndex + 1];
      const sourceParentID = sourceParts[sourceParentAgendaIndex + 1];
      const findSourcePrentIndex = rows.findIndex(
        (obj) => obj.ID === sourceParentID
      );
      // Get the source parent and sub-agenda objects
      const sourceParent = { ...rows[findSourcePrentIndex] };
      const findSourceSubAgendaIndex = sourceParent.subAgenda.findIndex(
        (obj) => obj.SubAgendaID === sourceSubAgendaID
      );
      const sourceSubAgenda =
        sourceParent.subAgenda[findSourceSubAgendaIndex];

      // for destination
      const destination = result.destination.droppableId;
      const destinationParts = destination.split("-");
      // destination Parent ID Index in responce
      const destinationParentAgendaIDIndex =
        destinationParts.indexOf("parent");
      //  sub agend destination index in responce
      const destinationSubAgendaIDIndex =
        destinationParts.indexOf("subAgendaID");
      // destination Parent ID in responce
      const destinationParentAgendaID =
        destinationParts[destinationParentAgendaIDIndex + 1];
      // sub Agenda ID in jason responce
      const destinationSubAgendaID =
        destinationParts[destinationSubAgendaIDIndex + 1];
      // find index of parent in main json data
      const findDestinationParentIDIndex = rows.findIndex(
        (obj) => obj.ID === destinationParentAgendaID
      );
      const destinationParent = { ...rows[findDestinationParentIDIndex] };
      // find sub Agenda of that parent index
      const findDestinationSubAgendaIDIndex =
        destinationParent.subAgenda.findIndex(
          (obj) => obj.SubAgendaID === destinationSubAgendaID
        );
      const destinationSubAgenda =
        destinationParent.subAgenda[findDestinationSubAgendaIDIndex];
      // Remove the attachment from the source sub-agenda
      const movedAttachment = sourceSubAgenda.Subfiles.splice(
        result.source.index,
        1
      )[0];
      // Add the removed attachment to the destination sub-agenda's Subfiles array
      destinationSubAgenda.Subfiles.splice(
        result.destination.index,
        0,
        movedAttachment
      );
       // Update the rows data with the modified source and destination parent agendas
       const updatedRows = [...rows];
       updatedRows[findSourcePrentIndex] = sourceParent;
       updatedRows[findDestinationParentIDIndex] = destinationParent;
       setRows(updatedRows);
    }
  }
}