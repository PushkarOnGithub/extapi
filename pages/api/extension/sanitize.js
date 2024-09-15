function convertToResponseFormat(soln) {
  const addInvisibleChars = (text) => {
    return text.replace(/ /g, " \u200f\u200f\u200e\u200f\u200f\u200e");
  };

  function deepProcessBlocks(blocks) {
    blocks.forEach((block) => {
      if (block.block && block.block.editorContentState) {
        const content = block.block.editorContentState.content;
        content.forEach((node) => {
          if (node.content) {
            node.content.forEach((textNode) => {
              if (textNode.text) {
                textNode.text = addInvisibleChars(textNode.text);
              }
            });
          }
        });
      }
    });
  }
  console.log(soln);
  soln.answerBody.stepByStep.steps.forEach((step) => {
    deepProcessBlocks(step.blocks);
  });

  return soln;
}
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404);
  }
  const unfilteredData = JSON.parse(req.body).unfilteredData;
  console.log("unfilteredData", unfilteredData);
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ filteredData: convertToResponseFormat(unfilteredData) });
}