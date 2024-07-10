const xmljs = require("xml-js");
const { Buffer } = require("buffer");

// Polyfill Buffer for browser environment
window.Buffer = Buffer;
// Function to convert XML to JSON
const xmlToJson = (xmlString) => {
  try {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const result = xmljs.xml2json(xmlString, options);
    return JSON.parse(result);
  } catch (error) {
    console.error("Error converting XML to JSON:", error);
  }
};

// Function to convert JSON to XML
const jsonToXml = (jsonObject) => {
  try {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const xmlString = xmljs.json2xml(JSON.stringify(jsonObject), options);
    return xmlString;
  } catch (error) {
    console.error("Error converting JSON to XML:", error);
  }
};

// === used for read only Form Fields=== //

export const processXmlForReadOnly = (xmlString, nameValues) => {
  // Parse the XML string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Iterate through each name value
  nameValues.forEach((nameValue) => {
    // Find the ffield with the specified name attribute value
    const ffield = xmlDoc.querySelector(`ffield[name="${nameValue}"]`);

    if (ffield) {
      // Check if the ffield already has a flags attribute
      const flagsAttribute = ffield.getAttribute("flags");

      if (!flagsAttribute) {
        // If flags attribute does not exist, add it with value "ReadOnly"
        ffield.setAttribute("flags", "ReadOnly");
      } else {
        // If flags attribute exists, append "ReadOnly" to its value if it's not already there
        if (!flagsAttribute.includes("ReadOnly")) {
          ffield.setAttribute("flags", `${flagsAttribute} ReadOnly`);
        }
      }
    }
  });

  // Serialize the updated XML back to string
  const updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
  return updatedXmlString;
};
export const revertProcessXmlForReadOnly = (xmlString, nameValues) => {
  // Parse the XML string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  // Iterate through each name value
  nameValues.forEach((nameValue) => {
    // Find the ffield with the specified name attribute value
    const ffield = xmlDoc.querySelector(`ffield[name="${nameValue}"]`);

    if (ffield) {
      // Check if the ffield has a flags attribute
      const flagsAttribute = ffield.getAttribute("flags");

      if (flagsAttribute) {
        // Remove "ReadOnly" from the flags attribute value
        const newFlagsAttribute = flagsAttribute
          .replace(/\bReadOnly\b/, "")
          .trim();

        // If the new flags attribute is empty, remove it completely
        if (newFlagsAttribute) {
          ffield.setAttribute("flags", newFlagsAttribute);
        } else {
          ffield.removeAttribute("flags");
        }
      }
    }
  });

  // Serialize the XML document back to a string
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
};
// === End === //

// === used for Hide Form Fields === //

export const processXmlToHideFields = (xmlString, nameValues) => {
  let convertXmlToJson = xmlToJson(xmlString);
  const removedItems = {
    fields: [],
    ffields: [],
    widgets: [],
  };

  // Helper function to remove matched items from an array and add to removedItems
  function removeMatchedItems(array, attrName, location) {
    const removed = [];
    const filteredArray = array.filter((item, index) => {
      const match = nameValues.includes(item._attributes[attrName]);
      if (match) {
        removed.push({ index, item });
      }
      return !match;
    });
    removedItems[location] = removedItems[location].concat(removed);
    return filteredArray;
  }

  // Process xfdf.field
  if (convertXmlToJson.xfdf.fields && convertXmlToJson.xfdf.fields.field) {
    convertXmlToJson.xfdf.fields.field = removeMatchedItems(
      convertXmlToJson.xfdf.fields.field,
      "name",
      "fields"
    );
  }

  // Process xfdf.pdf-info.ffield
  if (
    convertXmlToJson.xfdf["pdf-info"] &&
    convertXmlToJson.xfdf["pdf-info"].ffield
  ) {
    convertXmlToJson.xfdf["pdf-info"].ffield = removeMatchedItems(
      convertXmlToJson.xfdf["pdf-info"].ffield,
      "name",
      "ffields"
    );
  }

  // Process xfdf.pdf-info.widget
  if (
    convertXmlToJson.xfdf["pdf-info"] &&
    convertXmlToJson.xfdf["pdf-info"].widget
  ) {
    convertXmlToJson.xfdf["pdf-info"].widget = removeMatchedItems(
      convertXmlToJson.xfdf["pdf-info"].widget,
      "field",
      "widgets"
    );
  }
  const updatedXmlString = new XMLSerializer().serializeToString(
    new DOMParser().parseFromString(jsonToXml(convertXmlToJson), "text/xml")
  );
  return {
    updatedXmlString,
    removedItems,
  };
};

export const revertProcessXmlToHideFields = (xml, removedItems) => {
  // Convert the updated XML string back to JSON
  let convertXmlToJson = xmlToJson(xml);
  // Helper function to reinsert removed items back to their original positions
  function reinsertRemovedItems(array, removedArray) {
    removedArray.forEach(({ index, item }) => {
      array.splice(index, 0, item);
    });
    return array;
  }

  // Reinsert removed items for xfdf.field
  if (convertXmlToJson.xfdf.fields && convertXmlToJson.xfdf.fields.field) {
    convertXmlToJson.xfdf.fields.field = reinsertRemovedItems(
      convertXmlToJson.xfdf.fields.field,
      removedItems.fields
    );
  }

  // Reinsert removed items for xfdf.pdf-info.ffield
  if (
    convertXmlToJson.xfdf["pdf-info"] &&
    convertXmlToJson.xfdf["pdf-info"].ffield
  ) {
    convertXmlToJson.xfdf["pdf-info"].ffield = reinsertRemovedItems(
      convertXmlToJson.xfdf["pdf-info"].ffield,
      removedItems.ffields
    );
  }

  // Reinsert removed items for xfdf.pdf-info.widget
  if (
    convertXmlToJson.xfdf["pdf-info"] &&
    convertXmlToJson.xfdf["pdf-info"].widget
  ) {
    convertXmlToJson.xfdf["pdf-info"].widget = reinsertRemovedItems(
      convertXmlToJson.xfdf["pdf-info"].widget,
      removedItems.widgets
    );
  }
  let newConvertXmlToJson = jsonToXml(convertXmlToJson);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(newConvertXmlToJson, "text/xml");
  const updatedXmlString = new XMLSerializer().serializeToString(xmlDoc);
  return updatedXmlString;
};
// === End === //

// === used for read only Freetext Fields === //

export const readOnlyFreetextElements = (xmlString, userDataRead) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const freetextElements = xmlDoc.querySelectorAll("freetext");
  const serializer = new XMLSerializer();

  freetextElements.forEach((freetextElement) => {
    const subject = freetextElement.getAttribute("subject");
    const userIdIndex = subject.lastIndexOf("-");
    if (userIdIndex !== -1) {
      const userId = subject.substring(userIdIndex + 1);
      if (userDataRead.includes(Number(userId))) {
        // User ID matches, set the annotation as read-only
        freetextElement.setAttribute("flags", "print,locked,lockedcontents");
      }
    }
  });

  // Serialize the modified XML back to a string
  const filteredXmlString = serializer.serializeToString(xmlDoc);
  return filteredXmlString;
};

export const revertReadOnlyFreetextElements = (xmlString, userDataRead) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const freetextElements = xmlDoc.querySelectorAll("freetext");
  const serializer = new XMLSerializer();

  freetextElements.forEach((freetextElement) => {
    const subject = freetextElement.getAttribute("subject");
    const userIdIndex = subject.lastIndexOf("-");
    if (userIdIndex !== -1) {
      const userId = subject.substring(userIdIndex + 1);
      if (userDataRead.includes(Number(userId))) {
        // User ID matches, set the annotation flags to "print"
        freetextElement.setAttribute("flags", "print");
      }
    }
  });

  // Serialize the modified XML back to a string
  const filteredXmlString = serializer.serializeToString(xmlDoc);
  return filteredXmlString;
};

// === End === //

// === used for hide Freetext Fields === //

export const hideFreetextElements = (xmlString, userDataRead) => {
  try {
    // Convert the XML string to JSON
    let convertXmlToJson = xmlToJson(xmlString);
    const removedHideFreetextElements = [];

    // Helper function to remove matched items from an array and add to removedItems
    function removeMatchedItems(array, attrName) {
      const removed = [];
      const filteredArray = array.filter((item, index) => {
        const subject = item._attributes[attrName];
        const userIdIndex = subject.lastIndexOf("-");
        if (userIdIndex !== -1) {
          const userId = subject.substring(userIdIndex + 1);
          const match = userDataRead.includes(Number(userId));
          if (match) {
            // User ID matches, add the annotation to removedItems
            removed.push({ index, item });
            return false; // Remove the item from the array
          }
        }
        return true;
      });
      removedHideFreetextElements.push(...removed);
      return filteredArray;
    }

    // Process xfdf.annots.freetext
    if (convertXmlToJson.xfdf.annots && convertXmlToJson.xfdf.annots.freetext) {
      convertXmlToJson.xfdf.annots.freetext = removeMatchedItems(
        convertXmlToJson.xfdf.annots.freetext,
        "subject"
      );
    }

    // Convert the updated JSON back to an XML string
    const hideFreetextXmlString = new XMLSerializer().serializeToString(
      new DOMParser().parseFromString(jsonToXml(convertXmlToJson), "text/xml")
    );
    return {
      hideFreetextXmlString,
      removedHideFreetextElements,
    };
  } catch (error) {
    console.error("Error in hideFreetextElements:", error);
    // Ensure to return a consistent structure even in case of error
    return {
      hideFreetextXmlString: "", // or null, depending on how you handle errors
      removedHideFreetextElements: [],
    };
  }
};

export const revertHideFreetextElements = (
  originalXmlString,
  removedItemsToRestore
) => {
  try {
    // Convert the original XML string to JSON
    let convertXmlToJson = xmlToJson(originalXmlString);

    // Helper function to restore removed items back into the array
    function restoreRemovedItems(array, removedItems) {
      removedItems.forEach(({ index, item }) => {
        array.splice(index, 0, item); // Insert item back at original index
      });
      return array;
    }

    // Restore removed items to xfdf.annots.freetext
    if (convertXmlToJson.xfdf.annots && convertXmlToJson.xfdf.annots.freetext) {
      convertXmlToJson.xfdf.annots.freetext = restoreRemovedItems(
        convertXmlToJson.xfdf.annots.freetext,
        removedItemsToRestore
      );
    }

    // Convert the updated JSON back to an XML string
    const restoredXmlString = new XMLSerializer().serializeToString(
      new DOMParser().parseFromString(jsonToXml(convertXmlToJson), "text/xml")
    );
    return restoredXmlString;
  } catch (error) {
    console.error("Error in revertHiddenFreetextElements:", error);
    // Handle errors gracefully, return original XML string if revert fails
    return originalXmlString;
  }
};

// === End === //

export const handleBlobFiles = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: "application/pdf" });
};
