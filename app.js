//********************Selecting Elements********************
const kanbanColumns = document.querySelectorAll('.kanban__column');
const addItemBtns = document.querySelectorAll('.kanban__add-item');
const deleteAllBtn= document.querySelector('.delete-all-btn');
const modal = document.getElementById('modal');
let draggedElement={};
let itemsStorage=[];
//********************Functions********************
//>>>>>>Adding Item Logic
const addNewItem = (column,text='...',frmLclStrg=false) => {
    const newItemNode = createNewItem(text,frmLclStrg);
    //insert the item in the end of the column , before the + Add Button
    column.insertBefore(newItemNode, column.lastElementChild);
};

const createNewItem = (text,frmLclStrg) => {
    //constructing the element
    const itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'kanban__items');
    itemNode.setAttribute('draggable', 'true'); //making the item draggable
    itemNode.innerHTML = `
    <div  class="kanban__item-input">
        <div contenteditable id="input">
            ${text}
        </div>
        <div class="item-btns">
            <button hidden class="deletebtn">Delete</button>
            <button hidden class="editbtn">Edit</button>
            <button class="editbtn" id="confirm-add">✔</button>
        </div>
    </div>
    <div class="kanban__dropzone"></div>
    `;

    //delete (...) when clicking on it
    itemNode.querySelector('#input').addEventListener('click',(e)=>{
        if(e.target.innerText==='...'){
            e.target.textContent='';
        }
    });

    //edit Button Logic
    const editBtn = itemNode.querySelector('.editbtn');
    editBtn.addEventListener('click', () => {
        //make the input editable
        itemNode.querySelector('#input').setAttribute('contenteditable', '');

        //show confirm button , and hide edit and delete buttons
        itemNode.querySelectorAll('button').forEach((btn) => {
            btn.toggleAttribute('hidden');
        });
    });

    //delete Button Logic
    const deleteBtn = itemNode.querySelector('.deletebtn');
    deleteBtn.addEventListener('click', (e) => {
        //deleting the item div
        console.log(e.target.parentElement.parentElement.parentElement);
        e.target.parentElement.parentElement.parentElement.remove();
    });

    //confirm Button Logic
    const confirmAddBtn = itemNode.querySelector('#confirm-add');
    confirmAddBtn.addEventListener('click', (e) => {
        //the if check is to prevent the item from being empty..
        if(itemNode.querySelector('#input').innerText===''){
            itemNode.querySelector('#input').innerText='...';
        }else{
            //make the input uneditable
            itemNode.querySelector('#input').removeAttribute('contenteditable');
    
            //hide confirm button , and show edit and delete buttons
            itemNode.querySelectorAll('button').forEach((btn) => {
                btn.toggleAttribute('hidden');
            });
        }

    });

    //dragging Logic : 
    itemNode.addEventListener('dragstart',e=>{
        draggedElement = itemNode;
    });

    if(frmLclStrg){
        confirmAddBtn.click();
    }

    return itemNode;
};

//********************Event Listners********************
addItemBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        console.dir(e.target.parentElement);
        console.log(e.target.parentElement);
        addNewItem(e.target.parentElement);
    });
});

//>>>>Handling Dropping Logic
kanbanColumns.forEach(column=>{
    column.addEventListener('dragenter',(e)=>{
        e.preventDefault();//To Allaw Dropping
        console.log('enter');
    });
    column.addEventListener('dragover',(e)=>{
        e.preventDefault();//To Allaw Dropping
        console.log('over');
    });
    column.addEventListener('dragleave',(e)=>{
        console.log('leave');
    });
    column.addEventListener('drop',(e)=>{
        e.currentTarget.insertBefore(draggedElement, e.currentTarget.lastElementChild);//Current Target is always the column 
        console.log(e.currentTarget);
    });
});


deleteAllBtn.addEventListener('click',()=>{
    modal.showModal();
});

//close modal
modal.querySelector('.editbtn').addEventListener('click',()=>{
    modal.close();
});

//confirm deleting all items
modal.querySelector('.deletebtn').addEventListener('click',()=>{
    modal.close();
    kanbanColumns.forEach(column=>{
        column.querySelectorAll('.kanban__items').forEach(item=>{
            item.remove();
        })
    });
});

//********************Local Storage********************
//store the items on the close 
window.addEventListener('beforeunload',()=>{
    //Array of Array of text of every item
    itemsStorage = [...kanbanColumns].map(col=>{//nodelist can't accept .map function
        //Extracting array of text of every column
        col = [...col.querySelectorAll('.kanban__items')].reduce((result,itemNode)=>{
            //Extracting the text of every item 
            const txt = itemNode.querySelector('#input').innerText;
            //skip empty items
            if(txt !== '...'){
                result.push(txt);
            }
            return result;
        },[]);
        return col;
    });
    //storing it in localstorage
    localStorage.items =JSON.stringify(itemsStorage);
});

//Retrieving items from Localstorage on load
window.addEventListener('load',()=>{
    //Retrieve Data 
    itemsStorage =JSON.parse(localStorage.items);
    let i = 0;
    kanbanColumns.forEach(col=>{
        for(let txt of itemsStorage[i]){
            addNewItem(col,txt,true)
        }
        ++i;
    })
});



