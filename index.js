// alert("LMAO");

const asleep =  (delay) => {
    return new Promise(resolve => setTimeout(resolve,delay));
}

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "https://www.shakenep.com";

(async () => {

    while(!document.getElementsByClassName("pdp-product-title")[0]){
        await asleep(100);
    }

    const cat = document.getElementsByClassName("breadcrumb_item")[0].textContent.trim();
    const name = document.getElementsByClassName("pdp-product-title")[0].textContent.trim();

    const priceElem = document.getElementsByClassName("pdp-product-price")[0];

    console.log(priceElem);

    const price = parseInt(
        priceElem.textContent
            .replace("Rs.","")
            .replaceAll(",","")
            .trim()
    );

    const url = new URL(`${BASE_URL}/matches`);
    const params = {
        title: name,
        price:price,
        category:cat,
        pathname: document.location.pathname
    }

    Object.keys(params).forEach(key => url.searchParams.append(key,params[key]));

    console.log("Getting: ",url);

    let result;

    try {
        const resp = await fetch(url);
        result = await resp.json();
    }
    catch(err){
        console.log("Error!");
        console.log(err);
        return;
    }

    console.log("Got!");
    console.log(result);

    const domElem = document.getElementById("module_product_price_1")
    const newContainer = document.createElement("ul");

    const noImageLink = "https://hamrobazaar.obs.ap-southeast-3.myhuaweicloud.com/Assets/NoImage.png";


    for (const item of result){

        let imageLink = item.image ? item.image : noImageLink;
        console.log(item);

        // Get hostname from link and trim www.
        const hostname = new URL(item.link).hostname
                        .replace("www.","");






        const html = `
        <div style="padding: 5px;">
            <a href="${item.link}" target="_blank">
                <div style="display: flex;padding: 5px;">
                    <div style="width: 50px">
                        <img style="width:50px; height:50px" src="${imageLink}"/>
                    </div>
                    <div style="display: flex; flex-direction: column; padding: 0px 5px">
                        <div style="flex-grow: 1; font-size: 1.5em;">
                            ${item.title}
                            <img style="border: 1px solid black; border-radius: 5px; height:15px" src="${BASE_URL}/static/${hostname}.png"/>
                        </div>
                        <div style="color: #f57224; font-size: 2em;">Rs. ${item.price}</div>
                    </div>
                </div>
            </a>
        </div>
        
        <div style="display: flex; justify-content: center">
            <hr style="width: 90%"/>
        <div>
        `;


        const tempContainer = document.createElement("li");

        tempContainer.innerHTML = html;

        //
        // const temp = document.createElement("a");
        // temp.setAttribute("target","_blank");
        // temp.setAttribute("href","https://beta.hamrobazaar.com/product/dummy/"+item.id);
        // temp.innerText = item.name + " | " + item.price;
        //
        // tempContainer.appendChild(temp);
        // newContainer.appendChild(tempContainer);

        newContainer.append(tempContainer);
    }

    if (newContainer.children.length > 0){
        newContainer.lastChild.lastChild.remove();
    }

    newContainer.style["border"] = "1px solid black";
    newContainer.style["fontSize"] = "10px";

    domElem.append(newContainer);


})();


// console.log(cat,name);