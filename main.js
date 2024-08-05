const searchInput = document.querySelector('.search-wrap__input');
const autocompleteList = document.querySelector('.search-wrap__results');
const repositoryList = document.querySelector('.search-wrap__repos');
const resultsItem = document.querySelectorAll('.results-item')
//запрос
searchInput.addEventListener('input', debounce(function() {
    const searchText = searchInput.value; 

    if (searchText) {
        fetch(`https://api.github.com/search/repositories?q=${searchText}&per_page=5`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при запросе к GitHub API')
                }
                return response.json();
            })
            .then(data => {
                console.log("Данные с GitHub:", data);
                
                for (let i = 0; i < resultsItem.length; i++) {
                    if (data.items[i]) {
                        const repoName = data.items[i].full_name;
                        resultsItem[i].textContent = repoName;
                        resultsItem[i].onclick = () => selectRepo(data.items[i]);
                        resultsItem[i].classList.add('show');
                    } else {
                        resultsItem[i].classList.remove('show'); 
                    }
                }
            })
            .catch(error => {
                console.error('Произошла ошибка:', error)
            });
    } else {
        for (let i = 0; i < resultsItem.length; i++) {
            resultsItem[i].classList.remove('show');
        }
    }
}, 400));

//debounce
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function selectRepo(dataRepo) {
    const listItem = Object.assign(document.createElement('li'), {
        className: 'repos-item',
    });
    const repoSaved = Object.assign(document.createElement('div'), {
        className: 'repos--saved',
    });

    const name = Object.assign(document.createElement('div'), {
        textContent: `Name: ${dataRepo.name}`,
        className: 'repos-name',
    });

    const owner = Object.assign(document.createElement('div'), {
        textContent: `Owner: ${dataRepo.owner.login}`,
        className: 'repos-owner',
    });

    const stars = Object.assign(document.createElement('div'), {
        textContent: `Stars: ${dataRepo.stargazers_count}`,
        className: 'repos-stars',
    });

    const deleteButton = Object.assign(document.createElement('img'), {
        src: 'images/delete-btn.svg',
        className: 'delete-btn',  // className, а не classList 
    });

    deleteButton.addEventListener('click', () => {
        const listItemToRemove = deleteButton.closest('.repos-item');
        if (listItemToRemove) {
            listItemToRemove.remove();
        }
    });

    repoSaved.appendChild(name);
    repoSaved.appendChild(owner);
    repoSaved.appendChild(stars);
    listItem.appendChild(repoSaved);
    listItem.appendChild(deleteButton);

    repositoryList.appendChild(listItem)
}