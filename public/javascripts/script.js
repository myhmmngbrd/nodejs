'use strict';


class MyDirectory {
    constructor(root) {
        return (async () => {
            const ol = document.createElement('ol');
            root.appendChild(ol);

            const files = await this.getFileList();

            console.log(files);

            MyDirectory.createBranch(files, ol);
        })();
    }

    getFileList() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(JSON.parse(this.responseText));
            };
            xhr.onerror = function() {
                reject({
                    status: this.status,
                    statusText: this.statusText,
                });
            };
            xhr.open('post', '/');
            xhr.send();
        });
    }

    static createBranch(files, stem, index = 0, depth = 0) {

        for (let i in files) {
            const file = files[i];
            
            const li = document.createElement('li');
            li.classList.add('clickable');      
            li.addEventListener('mousedown', MyDirectory.select); 
            li.depth = depth
            
            if (!file.isfile) {
                li.childlist = file.childlist;
                li.addEventListener('click', MyDirectory.expand);
                li.classList.add('folder');
            } else {
                li.classList.add('file');
                li.src = file.src;
                li.addEventListener('click', MyDirectory.fileRequest)
            }

            const icon = document.createElement('div');
            icon.innerHTML = '&nbsp;'.repeat(depth * 2) + (!file.childlist ? '○': '▷');
            const name = document.createElement('div');
            name.innerText = file.name;

            li.appendChild(icon);
            li.appendChild(name);

            if (stem.children[++index]) {
                stem.insertBefore(li, stem.children[index]);
            } else {
                stem.appendChild(li);
            }
        }

        return index;
    }

    static expand() {
        this.children[0].innerHTML = '&nbsp;'.repeat(this.depth * 2) + '▼';

        const [files, stem, index, depth] = [
            this.childlist,
            this.parentNode,
            [].indexOf.call(this.parentNode.children, this),
            this.depth + 1
        ]
        MyDirectory.createBranch(files, stem, index, depth);

        this.removeEventListener('click', MyDirectory.expand);
        this.addEventListener('click', MyDirectory.fold);
    }
    
    static fold() {
        this.children[0].innerHTML = '&nbsp;'.repeat(this.depth * 2) + '▷';

        const stem = this.parentNode
        let index = [].indexOf.call(stem.children, this);
        while (stem.children[index + 1].depth > this.depth) {
            stem.removeChild(stem.children[index + 1]);
        }

        this.removeEventListener('click', MyDirectory.fold);
        this.addEventListener('click', MyDirectory.expand);
    }

    static select() {
        for (let widget of this.parentNode.children) {
            widget.classList.remove('selected');
        }
        this.classList.add('selected');
    }

    static fileRequest() {
        const src = '\\file' + this.src + this.children[1].innerText
        const xhr = new XMLHttpRequest();
        xhr.onload 
    }
}




const widget = document.querySelector('#dir');
new MyDirectory(widget);


