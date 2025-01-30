export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404);
  }
  try {
    const unfilteredData = JSON.parse(req.body).unfilteredData; // for production
    // const unfilteredData = req.body; // for development
    console.log("unfilteredData", unfilteredData);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res
      .status(200)
      .json({ filteredData: convertToResponseFormat(unfilteredData) });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

// function to generate random string containing quotes
function getRandomQuotationString() {
  return '"'.repeat(10 * Math.ceil(Math.random() * 5));
}

// function to wrap the given string with random quotes
function getWrappedString(str) {
  return `${getRandomQuotationString()}${str}${getRandomQuotationString()}`;
}
// console.log(getRandomQuotationString());

function addQuotesToText(content) {
  content.forEach((item) => {
    if (item.type === "orderedList") {
      item?.content?.forEach((subItem) => {
        subItem?.content?.forEach((subSubItem) => {
          subSubItem?.content?.forEach((subSubSubItem) => {
            if (subSubSubItem.type === "inlineMath") {
              subSubSubItem.content.forEach((subSubSubSubItem) => {
                subSubSubSubItem.text = getWrappedString(subSubSubSubItem.text);
              });
            }
          });
        });
      });
    } else {
      item?.content?.forEach((subItem) => {
        if (subItem.type === "inlineMath") {
          subItem?.content?.forEach((subSubItem) => {
            if (subSubItem.type === "text") {
              subSubItem.text = getWrappedString(subSubItem.text);
            }
          });
        }
      });
    }
  });
}

function convertToResponseFormat(soln) {
  // Traverse and modify steps
  soln.answerBody.stepByStep.steps.forEach((step) => {
    step.blocks.forEach((block) => {
      if (
        ["TEXT", "EXPLANATION"].includes(block.type) &&
        block.block.editorContentState
      ) {
        addQuotesToText(block.block.editorContentState.content);
      }
      if (block.type === "EQUATION_RENDERER" && block.block.lines) {
        block.block.lines.forEach((line) => {
          line.left = getWrappedString(line.left);
          line.right = getWrappedString(line.right);
        });
      }
    });
  });

  // Traverse and modify finalAnswer
  soln.answerBody.finalAnswer.blocks.forEach((block) => {
    if (
      ["TEXT", "EXPLANATION"].includes(block.type) &&
      block.block.editorContentState
    ) {
      addQuotesToText(block.block.editorContentState.content);
    }
    if (block.type === "EQUATION_RENDERER" && block.block.lines) {
      block.block.lines.forEach((line) => {
        line.left = getWrappedString(line.left);
        line.right = getWrappedString(line.right);
      });
    }
  });

  return soln;
}
