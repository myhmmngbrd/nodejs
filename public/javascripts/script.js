

const widget = document.querySelector('#dir');

const xhr = new XMLHttpRequest();
xhr.onload = function() {
    data = JSON.parse(this.responseText);

    createDir(data, widget)

}
xhr.open('post', '/');
xhr.setRequestHeader('content-type', 'application/json');
xhr.send();

function createDir(files, root) {
    const ol = document.createElement('ol');
    root.appendChild(ol);


    files.sort((a, b) => (a.childlist ? 0 : 1) - (b.childlist ? 0 : 1));

    for (i in files) {
        const li = document.createElement('li');
        li.classList.add('clickable');
        ol.appendChild(li);

        file = files[i];
        if (file.childlist) {
            li.addEventListener('click', fold)
        }

        const icon = document.createElement('div');
        icon.innerText = file.childlist ? '▷' : '○'
        
        const name = document.createElement('div');
        name.innerText = file.name;

        li.appendChild(icon);
        li.appendChild(name);

    }
}

function fold() {
    console.log('fold');
    this.children[0].innerText = '▼'
    this.addEventListener('click',expand);
    this.removeEventListener('click', fold);
}


function expand() {
    console.log('expand');
    this.children[0].innerText = '▷'
    this.addEventListener('click', fold);
    this.removeEventListener('click', expand);


}