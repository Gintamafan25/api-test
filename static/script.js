document.addEventListener("DOMContentLoaded", async ()=>{
    let dataSetOne = await loadData();
    console.log(dataSetOne);
    
    let masterList = []

    
})
const url = 'https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=tech'

function masterLoader(masterList,data) {
    masterList.length = 0;
    data.foreach((a) =>{
        console.log(a)
    })
}

function treeWalker(masterList,node) {
    if (!node.isArray() && node !== null && typeof node === object) {
        masterList.push({dataType: typeof node, layer: })
    }
}



async function loadData() {
    try {
        let response = await fetch(url);
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