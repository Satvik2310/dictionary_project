const form = document.querySelector('form');
const result = document.querySelector('.result');

// Hide result box initially
result.style.display = "none";

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value.trim());
});

const getWordInfo = async (word) => {
    try {
        // Show result box when fetching data
        result.style.display = "block";  
        result.innerHTML = "Fetching Data .....";

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        console.log('Full data:', data);

        if (!data || !data[0]) {
            result.innerHTML = `<p>Sorry, the word could not be found</p>`;
            return;
        }

        const wordData = data[0];
        const meaningData = wordData.meanings[0];

        result.innerHTML = `
            <h2><b>Word:</b> ${wordData.word}</h2>
            <p class="part"><b></b> ${meaningData.partOfSpeech}</p>
            <p><b>Meaning:</b> ${meaningData.definitions[0].definition || "Not found"}</p>
            <p><b>Example:</b> ${meaningData.definitions[0].example || "Not found"}</p>
        `;

        // Handle antonyms
        let antonymsHTML = "<p>Not Found</p>";
        if (meaningData.antonyms && meaningData.antonyms.length > 0) {
            antonymsHTML = "<ul>";
            for (let i = 0; i < meaningData.antonyms.length; i++) {
                antonymsHTML += `<li>${meaningData.antonyms[i]}</li>`;
            }
            antonymsHTML += "</ul>";
        }

        // Handle synonyms
        let synonymsHTML = "<p>Not Found</p>";
        if (meaningData.synonyms && meaningData.synonyms.length > 0) {
            synonymsHTML = "<ul>";
            for (let i = 0; i < meaningData.synonyms.length; i++) {
                synonymsHTML += `<li>${meaningData.synonyms[i]}</li>`;
            }
            synonymsHTML += "</ul>";
        }

        result.innerHTML += `
            <p><b>Antonyms:</b> ${antonymsHTML}</p>
            <p><b>Synonyms:</b> ${synonymsHTML}</p>
        `;

        if (wordData.sourceUrls && wordData.sourceUrls.length > 0) {
            result.innerHTML += `<div><a href="${wordData.sourceUrls[0]}" target="_blank">Read More</a></div>`;
        }

    } catch (error) {
        result.innerHTML = `<p>Sorry, the word could not be found</p>`;
        console.error('Error fetching word data:', error);
    }
};
