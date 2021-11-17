var languageButtonsEl = document.querySelector("#language-buttons");

// variables to reference DOM search elements
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {

    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        
        // if github username found, pass that data to DisplayRepos
        // if no username found, alert error message
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
        });

    } else {
        alert("Error: Github User Not Found");
    }
        
    })

    .catch(function(error) {

        // handle network connection errors
        // notice this '.catch()' getting chained onto the end of the '.then()' method
        alert("Unable to connect to GitHub");
    });
};

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element via nameInputEl DOM variable
    // and store in its own variable called username
    // trim takes care of leading or trailing spaces in input element
    var username = nameInputEl.value.trim(); 

    // check that there is a value in username variable
    // if username has a value, pass that value to getUserRepos function
    // as an argument and then clear out input element's value
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
    console.log(event);
}

var displayRepos = function(repos, searchTerm) {

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories Found.";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    console.log(repos);
    console.log(searchTerm);

    // loop over repos
    // take each repo (repos[i]) and write its data to the page
    // format the appearance of the repo name
    // style the div element
    // create span to hold the formatted repo name
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo and style div
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // append container to the DOM
        repoContainerEl.appendChild(repoEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
              "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i> No issues";
        }

        // append to container
        repoEl.appendChild(statusEl);
    }
};


var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: Github User Not Found');
        }
    });
};


var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);

    if (language) {
        getFeaturedRepos(language);

        // clear old content
        repoContainerEl.textContent = "";
    }

};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
