document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category");
  const songSelect = document.getElementById("song");
  const pptxContainer = document.getElementById("pptxContainer");
  const downloadButton = document.getElementById("downloadButton");

  function loadSongList() {
    const selectedCategory = categorySelect.value;
    const songSelectContainer = document.getElementById("songSelectContainer");
    const songLabel = document.getElementById("songLabel");
    const songSelect = document.getElementById("song");

    if (selectedCategory) {
      fetch(`source/list/${selectedCategory}.txt`)
        .then(response => response.text())
        .then(data => {
          const songList = data.split("\n");

          // Remove the first three lines and songs with "_english"
          const filteredSongList = songList.slice(3).filter(song => !song.includes("_english"));

          // Clear the previous options
          songSelect.innerHTML = "";

          // Create and add new options
          filteredSongList.forEach(song => {
            if (song.trim() !== "") {
              const option = document.createElement("option");
              option.value = song.trim();
              option.text = song.trim();
              songSelect.appendChild(option);
            }
          });

          // Show the song select container
          songSelectContainer.style.display = "block";
          songLabel.style.visibility = "visible";
        })
        .catch(error => {
          console.log("Error loading song list:", error);
        });
    } else {
      // Hide the song select container if no category is selected
      songSelectContainer.style.display = "none";
      songLabel.style.visibility = "hidden";
    }
  }

  function displaySong() {
    const selectedCategory = categorySelect.value;
    const selectedSong = songSelect.value;
    const songContentLeft = document.getElementById("songContentLeft");
    const songContentRight = document.getElementById("songContentRight");

    if (selectedCategory && selectedSong) {
      const filePath = `source/output/${selectedCategory}/${selectedSong}.txt`;
      const filePathEnglish = `source/output/${selectedCategory}/${selectedSong}_english.txt`;

      // Check if the song file exists
      fetch(filePath)
        .then(response => {
          if (!response.ok) {
            throw new Error("Song not available");
          }
          return response.text();
        })
        .then(data => {
          songContentLeft.innerHTML = `<pre>${data}</pre>`;
          songContentLeft.style.display = "block";
        })
        .catch(error => {
          console.log("Error loading song:", error);
          songContentLeft.innerHTML = "<p>Song not available</p>";
          songContentLeft.style.display = "block";
        });

      // Check if the English song file exists
      fetch(filePathEnglish)
        .then(response => {
          if (!response.ok) {
            throw new Error("English lyrics not available");
          }
          return response.text();
        })
        .then(data => {
          songContentRight.innerHTML = `<pre>${data}</pre>`;
          songContentRight.style.display = "block";
        })
        .catch(error => {
          console.log("English lyrics not available");
          songContentRight.style.display = "none";
        });
    } else {
      songContentLeft.innerHTML = "";
      songContentRight.innerHTML = "";
      songContentLeft.style.display = "none";
      songContentRight.style.display = "none";
    }
  }

  function displayPPTX() {
    const selectedCategory = categorySelect.value;
    const selectedSong = songSelect.value;

    if (selectedCategory && selectedSong) {
      const pptxFilePath = `source/PTOutput/${selectedCategory}/${selectedSong}.pptx`;

      // Check if the PPTX file exists
      fetch(pptxFilePath)
        .then(response => {
          if (!response.ok) {
            throw new Error("PPTX file not available");
          }
          return response.blob();
        })
        .then(blob => {
          // Create a URL for the blob object
          const pptxUrl = URL.createObjectURL(blob);

          // Enable the download button
          downloadButton.href = pptxUrl;
          downloadButton.download = `${selectedSong}.pptx`;
          downloadButton.style.display = "inline-block";

          // Hide the PPTX container
          pptxContainer.style.display = "none";
        })
        .catch(error => {
          console.log("Error loading PPTX file:", error);
          pptxContainer.style.display = "block";
          downloadButton.style.display = "none";
        });
    } else {
      // Hide the PPTX container and download button if no song is selected
      pptxContainer.style.display = "none";
      downloadButton.style.display = "none";
    }
  }

  // Hide song content and PPTX container initially
  const songContentLeft = document.getElementById("songContentLeft");
  const songContentRight = document.getElementById("songContentRight");
  songContentLeft.style.display = "none";
  songContentRight.style.display = "none";
  pptxContainer.style.display = "none";

  categorySelect.addEventListener("change", loadSongList);
  songSelect.addEventListener("change", displaySong);
  songSelect.addEventListener("change", displayPPTX);
});
