

function asyncRequest(method, href, param = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(this.responseText);
        }
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: this.statusText,
            });
        }
        xhr.open(method, href);
        xhr.send(param);
    });
}

class myFile {
    constructor(root, type, src) {
        this.init(root, type, src);
    }

    async init(root, type, src) {
        const name = document.createElement('p');
        name.innerText = src.split('\\').reverse()[0];
        root.appendChild(name);
        
        const contents = document.createElement('div');
        switch(type) {
            case 'text':
                const data = await asyncRequest('post', '\\text' + src);
                contents.innerText = data;
                break;
            case 'video':
                const video = document.createElement('video');
                video.setAttribute('controls', 'controls');
                const source = document.createElement('source');
                source.setAttribute('src', '\\video' + src);
                video.appendChild(source);
                contents.appendChild(video);
                break;
            case 'image':
                break;
            default:
                break;
        }
        root.appendChild(contents);
    }
}

class myDirectory {
    constructor(root) {
        this.init(root);
    }
    async init(root) {

        const ol = document.createElement('ol');
        const files = JSON.parse(await asyncRequest('post', '/'));
        console.log(files);

        this.createDir(ol, files);

        root.appendChild(ol);
    }

    createDir = (root, files, index = 0) => {
        for (let file of files) {
            const li = document.createElement('li');
            const depth = file.depth;
            li.status = file;
            
            const icon = document.createElement('div');
            const name = document.createElement('div');
            name.innerText = file.name;

            if (file.isfile) {
                switch(file.type) {
                    case 'text':
                        icon.innerHTML = '&nbsp;'.repeat(depth * 2) + 'ⓣ';
                        break;
                    case 'video':
                        icon.innerHTML = '&nbsp;'.repeat(depth * 2) + 'ⓥ';
                        break;
                    case 'image':
                        icon.innerHTML = '&nbsp;'.repeat(depth * 2) + 'ⓘ';
                        break;
                    default:
                        icon.innerHTML = '&nbsp;'.repeat(depth * 2) + '○';
                        break;
                }
                li.addEventListener('click', this.readFile);
            } else {
                icon.innerHTML = '&nbsp;'.repeat(depth * 2) + '▷';
                li.addEventListener('click', this.expand);
            }

            li.appendChild(icon);
            li.appendChild(name);

            if (!root.children[++index]) {
                root.appendChild(li);
            } else {
                root.insertBefore(li, root.children[index]);
            }
        }
    }

    expand = (event) => {
        const li = event.currentTarget;
        li.children[0].innerHTML = '&nbsp;'.repeat(li.status.depth * 2) + '▼';
        const ol = li.parentNode;
        li.removeEventListener('click', this.expand);
        li.addEventListener('click', this.fold);

        this.createDir(ol, li.status.childlist, [].indexOf.call(ol.children, li));
    }

    fold = (event) => {
        const li = event.currentTarget;
        li.children[0].innerHTML = '&nbsp;'.repeat(li.status.depth * 2) + '▷';
        const ol = li.parentNode;
        li.removeEventListener('click', this.fold);
        li.addEventListener('click', this.expand);

        const depth = li.status.depth;
        let nextli = li.nextSibling;
        let nextdepth = nextli.status.depth;
        while (nextdepth > depth) {
            ol.removeChild(nextli);
            nextli = li.nextSibling;
            nextdepth = nextli.status.depth;
        }
    }

    readFile = (event) => {
        const li = event.currentTarget;
        document.querySelector('#file').innerHTML = '';
        new myFile(document.querySelector('#file'), li.status.type, li.status.src + li.status.name);
    }

}

new myDirectory(document.querySelector('#dir'));