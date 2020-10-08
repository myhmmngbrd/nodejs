
class MyDirectory {
    constructor(root) {
        return (async () => {
            const ol = document.createElement('ol');
            root.appendChild(ol);

            const files = await this.getFileList();
            files.sort((a, b) => !a.childlist - !b.childlist);

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

    static createBranch(files, stem, parentDir = null, index = 0, depth = 0) {

        for (let i in files) {
            const file = files[i];
            
            const li = document.createElement('li');
            li.classList.add('clickable');       
            
            if (file.childlist) {
                li.childlist = file.childlist;
                li.parentDir = parentDir;
                li.depth = depth
                li.addEventListener('click', MyDirectory.expand);
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
    }

    static expand() {
        this.children[0].innerHTML = '&nbsp;'.repeat(this.depth * 2) + '▼';


        this.descendantNum = 0;
        let dir = this
        do {
            dir.descendantNum += this.childlist.length;
            console.log(dir.descendantNum);
        } while((dir = dir.parentDir));

        const [files, stem, parentDir, index, depth] = [
            this.childlist,
            this.parentNode,
            this,
            [].indexOf.call(this.parentNode.children, this),
            this.depth + 1
        ]
        MyDirectory.createBranch(files, stem, parentDir, index, depth);

        this.removeEventListener('click', MyDirectory.expand);
        this.addEventListener('click', MyDirectory.fold);
    }
    
    static fold() {

        console.log(this.descendantNum);

        this.children[0].innerHTML = '&nbsp;'.repeat(this.depth * 2) + '▷';

        let dir = this
        while ((dir = dir.parentDir)) {
            dir.descendantNum -= this.descendantNum;
        }

        const stem = this.parentNode
        const index = [].indexOf.call(stem.children, this);

        for (let i=0; i<this.descendantNum; i++) {
            stem.removeChild(stem.children[index + 1]);
        }

        this.descendantNum = 0;

        this.removeEventListener('click', MyDirectory.fold);
        this.addEventListener('click', MyDirectory.expand);
    }
}



widget = document.querySelector('#dir');
new MyDirectory(widget);


