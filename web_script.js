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

          // Exclude the first three lines
          const filteredSongList = songList.slice(3);

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
    const songContent = document.getElementById("songContent");

    if (selectedCategory && selectedSong) {
      const filePath = `source/output/${selectedCategory}/${selectedSong}.txt`;

      fetch(filePath)
        .then(response => response.text())
        .then(data => {
          songContent.innerHTML = `<pre>${data}</pre>`;
          songContent.style.display = "block";
        })
        .catch(error => {
          console.log("Error loading song:", error);
        });
    } else {
      songContent.innerHTML = "";
      songContent.style.display = "none";
    }
  }

  // Hide song content initially
  const songContent = document.getElementById("songContent");
  songContent.style.display = "none";

  categorySelect.addEventListener("change", loadSongList);
  songSelect.addEventListener("change", displaySong);
});
