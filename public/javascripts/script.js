

function readdir(dir = null) {
    const widget = document.querySelector('#dir');
    widget.innerHTML = '';
    const index = document.createElement('ol');
    widget.appendChild(index);
    
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        data = JSON.parse(this.responseText);      
        const { root, files } = data;
        //sort
        console.log(files)
        files.sort((a , b) => a.isfile - b.isfile);
        for (i in files) {
            const { name, isfile } = files[i];
            
            const filewidget = document.createElement('li');

            const icon = document.createElement('div');
            icon.innerHTML = isfile ? 'file' : 'folder';
            const nameplate = document.createElement('div');
            if (isfile) {
            } else {
                nameplate.addEventListener('click', function() {
                    console.log(1);
                    readdir(dir ? dir + '/' + name : '/' + name)
                    return false;

                });
            }
            nameplate.innerHTML = name
            
            filewidget.appendChild(icon);
            filewidget.appendChild(nameplate);

            index.appendChild(filewidget);
        }
    }
    xhr.open('post', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify({ dir }));

}


readdir();
