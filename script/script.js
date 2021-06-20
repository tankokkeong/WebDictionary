function addNewWordTrigger()
{
    var new_word_nav = document.getElementById("new-word-nav");
    var result_nav = document.getElementById("result-nav");

    // Display add new word form
    new_word_nav.style.display = "";

    // Remove results nav
    result_nav.style.display = "none";
}

function showWordResults()
{
    var new_word_nav = document.getElementById("new-word-nav");
    var result_nav = document.getElementById("result-nav");

    // Display results nav
    result_nav.style.display = "";

    // Remove add new word form
    new_word_nav.style.display = "none";
}

function addNewWord()
{
    var new_word = document.getElementById("new-word").value;
    var word_meaning = CKEDITOR.instances.word_meaning.getData();
    var example_sentences = CKEDITOR.instances.example_sentences.getData();
    var dictionaryDoc = firestore.collection("Dictionary").doc(new_word);

    //Record Timestamp
    var date = new Date();
    var timestamp = date.getTime();

    dictionaryDoc.set({
        wordMeaning : word_meaning,
        exampleSentences : example_sentences,
        createdAt : timestamp
    });


    showWordResults();
}

function displayCurrentWords()
{
    var keyword_lists = document.getElementById("keyword-lists");
    var dictionaryDoc = firestore.collection("Dictionary");

    dictionaryDoc.orderBy("createdAt", "asc").onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((word) => {
            keyword_lists.innerHTML = keyword_lists.innerHTML + 
            '<div class="keyword-container" onclick="displayWordInfo(\'' + word.doc.id + '\')">' +
                '<span>' + word.doc.id + '</span>' +
            '</div>';
        });
    });
}

function displayWordInfo(word_searched)
{
    var dictionaryDoc = firestore.collection("Dictionary").doc(word_searched);
    var search_word_displayed = document.getElementById("search-word-displayed");
    var meaning_displayed = document.getElementById("meaning-displayed");
    var example_sentence_list = document.getElementById("example-sentence-list");

    showWordResults();

    dictionaryDoc.get().then((word) => {
        if (!word.exists) {
            //Display word not found if word doesnt exist
            search_word_displayed.innerHTML = "Word not found";
        }
        else
        {
            //Display word info
            search_word_displayed.innerHTML = word_searched;
            meaning_displayed.innerHTML = word.data().wordMeaning
            example_sentence_list.innerHTML = word.data().exampleSentences
            console.log(word.data())
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}