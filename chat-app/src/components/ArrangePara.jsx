import React from 'react'

function ArrangePara(input) {
    // Split input text into lines
    const lines = input.split('.').filter(line => line.trim() !== '');
    
    // Initialize paragraph and counter
    let paragraph = '';
    let count = 1;
  
    // Iterate through each line and format with numbers
    lines.forEach(line => {
      // Check if the line contains a bullet point item
      if (line.trim().startsWith('*')) {
        // Extract the content after the bullet point, remove '**' if present
        const item = line.replace(/^\*\s*\*\*(.*?)\*\*:/, '$1:').trim();
        // Append numbered item to paragraph
        paragraph += `${count}. ${item} `;
        count++;
      } else {
        // Append regular text to paragraph
        paragraph += `${line} `;
      }
    });
  
    return paragraph.trim();
  }
  

export default ArrangePara
