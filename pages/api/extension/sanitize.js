function convertVowelsToLookAlikes(text) {
  // Define a map of vowels to their Unicode look-alike characters
  const lookAlikes = {
    a: "а", // Cyrillic Small Letter A
    e: "е", // Cyrillic Small Letter E
    i: "і", // Cyrillic Small Letter Byelorussian-Ukrainian i
    o: "ο", // Greek Small Letter Omicron
    u: "υ", // Greek Small Letter Upsilon
    A: "А", // Cyrillic Capital Letter A
    E: "Е", // Cyrillic Capital Letter E
    I: "І", // Cyrillic Capital Letter Byelorussian-Ukrainian i
    O: "Ο", // Greek Capital Letter Omicron
    U: "Υ", // Greek Capital Letter Upsilon
  };

  // Replace each vowel in the text with its look-alike
  const convertedText = text
    .split("")
    .map((char) => lookAlikes[char] || char)
    .join("");

  // Log both original and converted text along with Unicode values for verification
  console.log("Original Text:", text);
  console.log("Converted Text:", convertedText);

  console.log("\nCharacter-wise Comparison:");
  for (let i = 0; i < text.length; i++) {
    console.log(
      `${text[i]} (U+${text[i].charCodeAt(0).toString(16)}) → ${
        convertedText[i]
      } (U+${convertedText[i].charCodeAt(0).toString(16)})`
    );
  }

  return convertedText;
}

function convertToResponseFormat(soln) {
  function deepProcessBlocks(blocks) {
    blocks.forEach((block) => {
      if (block.block && block.block.editorContentState) {
        const content = block.block.editorContentState.content;
        content.forEach((node) => {
          if (node.content) {
            node.content.forEach((textNode) => {
              if (textNode.text) {
                textNode.text = convertVowelsToLookAlikes(textNode.text);
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
  try{
    const unfilteredData = JSON.parse(req.body).unfilteredData;  // for production
    // const unfilteredData = req.body;  // for development
    console.log("unfilteredData", unfilteredData);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ filteredData: convertToResponseFormat(unfilteredData) });
  }catch(e){
    return res.status(500).json({ message: e.message });
  }
}