document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category");
  const songSelect = document.getElementById("song");

function loadSongList() {
  const selectedCategory = categorySelect.value;

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
      })
      .catch(error => {
        console.log("Error loading song list:", error);
      });
  }
}

function displaySong() {
  const selectedCategory = categorySelect.value;
  const selectedSong = songSelect.value;

  if (selectedCategory && selectedSong) {
    const filePath = `source/output/${selectedCategory}/${selectedSong}.txt`;

    fetch(filePath)
      .then(response => response.text())
      .then(data => {
        const songContent = document.getElementById("songContent");
        songContent.innerHTML = `<pre>${data}</pre>`;
      })
      .catch(error => {
        console.log("Error loading song:", error);
      });
  }
}

  categorySelect.addEventListener("change", loadSongList);
  songSelect.addEventListener("change", displaySong);
});
