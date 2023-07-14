document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category");
  const songSelect = document.getElementById("song");

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

  // Hide song content initially
  const songContentLeft = document.getElementById("songContentLeft");
  const songContentRight = document.getElementById("songContentRight");
  songContentLeft.style.display = "none";
  songContentRight.style.display = "none";

  categorySelect.addEventListener("change", loadSongList);
  songSelect.addEventListener("change", displaySong);
});
