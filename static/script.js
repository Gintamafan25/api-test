document.addEventListener("DOMContentLoaded", async ()=>{
    let dataSetOne = await loadData();
    let url_list = await getList();
    
    
    let testData = {"tag": "rankings", "rated-ranks": [98,97,94], "number of raters" : 24 }
   
    let masterList = []
    masterLoader(masterList,dataSetOne)
    
   
   
})

const url = 'https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=tech'
const url2 = "api/books"

function masterLoader(masterList,data) {
    masterList.length = 0;
   

   
    const layer = 0
    masterList.push({dataType:typeof data, layer: layer, value : data, parent: null})
    let index = masterList.findIndex(item => item.value === data)
    
    for (let x in data) {
        treeWalker(masterList,data[x], layer, masterList[index])
    }
    
}

function treeWalker(masterList,node, layer, parent) {
    

    if (typeof node !== "object" ) {
        
        masterList.push({dataType : typeof node, layer : layer + 1, value : node, parent : parent})
        return
    } else {
        try {
            
            masterList.push({dataType: typeof node, layer : layer + 1, value: node, parent : parent})
            let index = masterList.findIndex(item => item.value === node)
            for (let y in node) {
                treeWalker(masterList, node[y], layer + 1, masterList[index])
            }
            
        } catch (e) {
            console.log(e, "error")
        }
    }

    return;
}

function displayList(list) {
    const table = document.createElement("table");
    const tableHeaderRow = document.createElement("tr")
    const tableHeader = document.createElement("th")

    
}

async function loadData() {
    try {
        let response = await fetch(url2);
        if (!response.ok) {
            console.log("HTTP Error:", response.status);
            return [];
        }

        return await response.json();
        

    } catch (e) {
        console.log("network error", e)
        return [];
    }
    
}

async function getList() {
    try {
        let response = await fetch("/api/list");
        if (!response.ok) {
            console.log("HTTP Error:", response.status);
            return []
        }

        return await response.json();
    } catch (e) {
        console.log("failed to load url lists", e)
        return [];
    }
}